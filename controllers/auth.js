// controladores de las rutas

const { response } = require('express')  
const bcrypt = require('bcryptjs')
const Usuario = require('../model/Usuario')
const { generarJWT } = require('../helpers/jwt')



const crearUsuario = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {


        //Buscar usuario en DB
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con este email '
            })
        }

        usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)


        //Guardar a DB
        await usuario.save();


        //Generar JWT (json web token )
        const token = await generarJWT(usuario._id, usuario.name)


        return res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token,
        });

    } catch (error) {

        console.log(error) 

        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}




const loginUsario = async (request, response = response) => {

    const { email, password } = request.body;

    try {

        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese email '
            })
        }

        //confirmar passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return response.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }


        //Generar JWT (json web token )
        const token = await generarJWT(usuario._id, usuario.name)


        response.json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token,
        })


    } catch (error) {

        console.log(error)
        return response.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}





const revalidarToken = async (request, response = response) => {

    const { uid, name } = request;

    const token = await generarJWT(uid, name)

    response.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {  
    crearUsuario,
    revalidarToken,
    loginUsario
}