module.exports = app => {
    const hasPermission = (name) => {
        return async (req, res, next) => {

            try {
                var method = req.method

                switch (method) {
                    case 'POST': method = 'c'
                        break
                    case 'GET': method = 'r'
                        break
                    case 'PUT': method = 'u'
                        break
                    case 'DELETE': method = 'd'
                        break
                    default:
                        res.send('Método não reconhecido para a aplicação').status(400)
                }

            } catch (e) {
                console.log(e)
                res.send('').status(500)
            }


            const permissionString = `${name}-${method}`
            console.log(permissionString)

            const user_id = req.user.id;

            const user = await app.model.user.forge({ id: user_id }).fetch({
                require: true,
                withRelated: [{
                    'permission': function (qb) {

                    },
                }]
            })

            try {
                const able = user.toJSON().permission.able;

                console.log(able)

                if (app.config.permission.hasPermission(able, permissionString))
                    next();
                else
                    return res.status(403).send('Não Autorizado');

            } catch (e) {

                console.log(e);

                return res.status(403).send();
            };

        }
    }
    return { hasPermission }
}