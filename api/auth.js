const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const { decode } = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const passportJwt = require('passport-jwt')
const { ExtractJwt } = passportJwt

module.exports = app => {

    const { existsOrError, equalsOrError, cpfValidator } = app.utils.validator // Esse destruct é feito para pegar as funções do arquivo .validator para serem usadas como funções nessa file 

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    } //Essa função se trata de um encriptamento do valor de password 

    const signin = async (req, res) => {

        let user = {}


        if (!req.user) {

            // try {
            //     cpfValidator(req.body.cpf, 'CPF inválido')
            // } catch (e) {
            //     res.status(400).send
            // }

            if (!req.body.cpf || !req.body.password) {
                return res.status(400).send('Informe cpf e senha')
            }

            user = await app.db.knex('users')
                .where({ cpf: req.body.cpf })
                .first()
                .catch(e => console.log(e))

            if (!user) return res.status(400).send("Usuário não encontrado")

            const isMatch = bcrypt.compareSync(req.body.password.toString(), user.password)

            if (!isMatch) return res.status(400).send('Cpf ou senha inválidos')
        } else {
            user = req.user;
            req.session = null;
        }

        let now = Math.floor(Date.now() / 1000)

        let payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            permission: user.permission,
            cpf: user.cpf,
            iat: now
        }

        if (req.body.remember !== true) {
            payload.exp = now + (60 * 60 * 2)
        } else {
            payload.exp = now + (60 * 60 * 24 * 7)
        }

        try {
            return res.json({
                ...payload,
                token: jwt.encode(payload, process.env.LOCAL_AUTH_SECRET)
            })
        } catch (e) {
            console.log(e);
        }

    }

    const signup = async (req, res) => {

        const userFromReq = { ...req.body }

        let user = {
            name: userFromReq.name,
            email: userFromReq.email,
            password: userFromReq.password,
            cpf: userFromReq.cpf,
            permission_id: userFromReq.permission_id
        }

        let confirmPassword = userFromReq.confirmPassword

        if (req.params.id) user.id = req.params.id;

        try {
            if (!user.id) {
                existsOrError(user.name, 'Nome não informado')
                existsOrError(user.email, 'Email não informado')
                existsOrError(user.cpf, 'CPF não informado')
                cpfValidator(user.cpf, 'CPF inválido')
                existsOrError(user.password, 'Senha não informada')
                existsOrError(confirmPassword, 'Digite duas vezes a senha')
                equalsOrError(user.password, confirmPassword, 'Senhas não conferem')

            }
        }

        catch (msg) {
            console.log(msg);
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        try{ 

        }catch{
            permission = await app.db.knex('permissions')
                .where({ cpf: req.body.cpf })
                .first()
                .catch(e => console.log(e))
        }

        try {

            await app.model.user.forge(user).save()
            return res.status(204).send();
        }

        catch (err) {
            console.log(err);
            if (err === 1062) return res.status(400).send("E-mail já cadastrado.");
            return res.status(500).send();
        }
    }


    return { signin, signup }
}