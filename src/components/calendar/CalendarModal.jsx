import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActive, eventUpdated } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');

const later = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: later.toDate()
};


export const CalendarModal = () => {

    const {modalOpen} = useSelector(state => state.ui);

    const {activeEvent} = useSelector(state => state.calendar);

    const dispatch = useDispatch();

    // const [DateStart, setDateStart] = useState(now.toDate());

    // const [DateEnd, setDateEnd] = useState(later.toDate());

    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initEvent);

    const {notes, title, start, end} = formValues;
    
    const handleInputChange = ({target}) => {

        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    };

    const closeModal = () => {
        setFormValues(initEvent);
        dispatch(eventClearActive());
        dispatch(uiCloseModal());
    };

    const afterOpenModal = () => {
        console.log('after open modal');
    };

    const handleStartDateChange = e => {
        // setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        });
    };

    const handleEndDateChange = e => {
        // setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const momentStart = moment(start);
        const momentEnd = moment(end);

        if(momentStart.isSameOrAfter(momentEnd)){
            return Swal.fire('Error', 'La fecha de fin debe ser mayor a la fecha de inicio', 'error');
        }

        if(title.trim().length < 2){
            return setTitleValid(false);
        }


        (activeEvent) ?
            // Actualizar el Evento
            dispatch(eventUpdated(formValues))
        :
            // Agregar un nuevo Evento
            (
                dispatch(eventAddNew({
                    id: new Date().getTime(),
                    ...formValues,
                    user: {
                        _id: '123',
                        name: 'Carlos'
                    }    
                }))
            )
        

        setTitleValid(true);
        closeModal();
    }

    useEffect(() => {
        
        activeEvent ? 
            setFormValues(activeEvent)
        :
            setFormValues(initEvent)

    }, [activeEvent, setFormValues])

    return (
        <Modal
            isOpen={modalOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >

            <h1>{ activeEvent ? 'Editar Evento' : 'Nuevo Evento' }</h1>
            <hr />
            <form className="container" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={start}
                        className="form-control"
                        
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={end}
                        className="form-control"
                        minDate={start}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${ !titleValid && 'is-invalid'} `}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> { activeEvent ? 'Actualizar' : 'Guardar'} </span>
                </button>

            </form>

        </Modal>
    )
}
