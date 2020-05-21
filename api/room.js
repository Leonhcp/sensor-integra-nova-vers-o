module.exports = app => {
    
    const { existsOrError} = app.utils.validator
    
    const save = async (req, res) => {
        
        const roomFromReq = { ...req.body };
        
        const roomFile = {...req.file}
        
        const room = {
            name: roomFromReq.name,
            responsible_id: roomFromReq.responsible_id
        }
        const users = roomFromReq.users;

        if (req.params.id) room.id = req.params.id;

        
        try {
            if (!room.id) {
                existsOrError(room.name, 'Nome não informado')
                existsOrError(users, "Usuários não informados")
                
            }
        } catch (e) {
            console.log(e)
            res.send().status(500)
        }
        
        try {

            if (room.id && Array.isArray(users) && users.length > 0) {
                await app.db.knex("users_rooms").where({ "room_id": room.id }).del()
            }

            await app.model.room.forge(room).save()
                .tap(dbRoom => {
                    return dbRoom.users().attach(users);
                });

            Object.keys(room).forEach(key => room[key] === undefined ? delete room[key] : '');
            await app.model.room.forge(room).save()
            
            return res.status(200).send()
        } catch (e) {
            console.log(e)
            res.send().status(500)
        }
        
    }

    const get = async (req, res) => {

        console.log(req.user)

        try {
            let rooms = await app.model.room.forge().fetchAll({
                require: true
            });
            return res.json(rooms.toJSON());
        } catch (e) {
            console.log(e);
            return res.status(500).send();
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db.knex('rooms')
                .del()
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, "Sala não encontrada")

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }



    return { save, get, remove }
}