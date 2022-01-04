const { response, request } = require("express");
const Evento = require("../model/Evento");

const getEventos = async (req = request, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name')

    return res.json({
        ok: true,
        eventos
    })
}



const crearEvento = async (req = request, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid

        await evento.save();

        res.json({
            ok: true,
            evento
        })

    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })

    }

}




const actualizarEvento = async (req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe ningun evento con este id'
            })
        }

        //Verificar si el usuario que creo el evento
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })

        return res.json({
            ok: true,
            eventoActualizado
        })

    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })

    }
}




const eliminarEvento = async(req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe ningun evento con este id'
            })
        }

        //Verificar si el usuario que creo el evento
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

        const eventoEliminado = await Evento.findOneAndDelete({_id : eventoId})

        return res.json({
            ok: true,
            eventoEliminado
        })

    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })

    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}