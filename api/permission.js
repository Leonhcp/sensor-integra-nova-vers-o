module.exports = app => {

    const { existsOrError } = app.utils.validator

    const save = async (req, res) => {

        const permissionFromReq = { ...req.body };

        
        let permission = {
            level: permissionFromReq.level,
            label: permissionFromReq.label,
            able: permissionFromReq.able
        }
        if (req.params.id) permission.id = req.params.id;
        
        try {
            if (!permission.id) {
                existsOrError(permission.level, 'Level não informada')
                existsOrError(permission.label, 'Label não informada')
                existsOrError(permission.able, 'Able não informado')
            }
        }

        catch (msg) {
            return res.status(400).send(msg)
        }

        try {
            Object.keys(permission).forEach(key => permission[key] === undefined ? delete permission[key] : '');

            await app.model.permission.forge(permission).save();
            return res.status(204).send();
        }
        catch (err) {
            console.log(err);
            if (err === 1062) return res.status(400).send();
            return res.status(500).send("Nível de acesso já cadastrado");
        }
    }

    const get = async (req, res) => {
        try {
            let permissions = await app.model.permission.forge().fetchAll();
            return res.json(permissions.toJSON());

        } catch (e) {
            console.log(e);
            return res.status(500).send();
        }
    }

    const exclude = async (req, res) => {
        try {
            await app.model.permission.forge().where({ "id": req.params.id }).destroy()
            res.send("Nível de acesso deletado")
        } catch (e) {
            console.log(e)
            return res.status(500).send()
        }
    }

    const getByLevel = async (req, res) => {

        level = req.params.id;
        try {
            let permissions = await app.model.permission.forge({ "level": level }).fetch()
            res.json(permissions.toJSON());
        } catch (e) {
            console.log(e);
            return res.status(500).send();
        }
    }
    return { save, get, exclude, getByLevel }
}