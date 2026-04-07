import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

function BookingPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: ''
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [occupiedSlots, setOccupiedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Horarios disponibles (10:00 a 20:00)
    const timeSlots = [
        "10:00", "11:00", "12:00", "13:00", "14:00", 
        "16:00", "17:00", "18:00", "19:00", "20:00"
    ];

    // Cargar horarios ocupados cuando cambia la fecha
    useEffect(() => {
        if (formData.date) {
            fetchOccupiedSlots(formData.date);
        }
    }, [formData.date]);

    const fetchOccupiedSlots = async (date) => {
        setLoadingSlots(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/bookings/?date=${date}`);
            // Extraemos solo las horas y las normalizamos a HH:mm
            const occupied = response.data.map(slot => {
                const [h, m] = slot.time.split(':');
                return `${h}:${m}`;
            });
            setOccupiedSlots(occupied);
        } catch (err) {
            console.error('Error fetching occupied slots:', err);
        } finally {
            setLoadingSlots(false);
        }
    };

    // Lógica para Calendario Personalizado
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handleDateSelect = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${dayStr}`;
        
        setSelectedDate(day);
        setFormData({ ...formData, date: dateString, time: '' }); // Reset time when date changes
    };

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time });
    };

    const renderCalendar = () => {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();
        const totalDays = daysInMonth(month, year);
        const startDay = (firstDayOfMonth(month, year) + 6) % 7; // Ajuste para Lunes = 0
        
        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        for (let d = 1; d <= totalDays; d++) {
            const dateObj = new Date(year, month, d);
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));
            const isSelected = selectedDate === d;
            
            days.push(
                <div 
                    key={d} 
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => !isPast && handleDateSelect(d)}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.date) {
            setError('Por favor, selecciona una fecha en el calendario.');
            return;
        }
        if (!formData.time) {
            setError('Por favor, selecciona un horario disponible.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${API_BASE_URL}/bookings/`, formData);
            setSuccess(true);
            
            const message = `Hola, he solicitado una cita en Van360Sound.%0A%0ADatos:%0A- Nombre: ${formData.name}%0A- Fecha: ${formData.date}%0A- Hora: ${formData.time}%0A- Notas: ${formData.notes || 'Ninguna'}`;
            const whatsappUrl = `https://wa.me/34622324177?text=${message}`;
            window.sessionStorage.setItem('whatsappUrl', whatsappUrl);
            
        } catch (err) {
            console.error('Error creating booking:', err);
            setError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="booking-page">
            <Helmet>
                <title>Reservar Cita | Van360Sound</title>
                <meta name="description" content="Reserva una cita con nuestros expertos en audio para asesoramiento personalizado." />
            </Helmet>

            <header className="page-header">
                <div className="container">
                    <h1>Agenda tu Cita</h1>
                    <p>Encuentra tu sonido ideal con la ayuda de nuestros especialistas.</p>
                </div>
            </header>

            <section className="booking-content container section-padding">
                <div className="booking-container">
                    {success ? (
                        <div className="success-card">
                            <div className="success-icon">✅</div>
                            <h2>¡Cita Solicitada!</h2>
                            <p>Recibirás una confirmación por email en breve.</p>
                            <a 
                                href={window.sessionStorage.getItem('whatsappUrl')} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp"
                            >
                                Confirmar ahora por WhatsApp
                            </a>
                            <button className="btn btn-secondary" onClick={() => setSuccess(false)}>Solicitar otra</button>
                        </div>
                    ) : (
                        <div className="booking-form-wrapper">
                            <form onSubmit={handleSubmit} className="booking-form">
                                <div className="form-group">
                                    <label>1. Selecciona el día</label>
                                    <div className="calendar-widget">
                                        <div className="calendar-header">
                                            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>‹</button>
                                            <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                                            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>›</button>
                                        </div>
                                        <div className="calendar-weekdays">
                                            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
                                        </div>
                                        <div className="calendar-grid">
                                            {renderCalendar()}
                                        </div>
                                    </div>
                                    {formData.date && <p className="selected-date-text">Seleccionado: <strong>{formData.date}</strong></p>}
                                </div>

                                <div className="form-group">
                                    <label>2. Horarios disponibles</label>
                                    {!formData.date ? (
                                        <p className="hint-text">Selecciona primero un día para ver los horarios.</p>
                                    ) : loadingSlots ? (
                                        <p className="loading-text">Cargando disponibilidad...</p>
                                    ) : (
                                        <div className="time-grid">
                                            {timeSlots.map(time => {
                                                const isOccupied = occupiedSlots.includes(time);
                                                const isSelected = formData.time === time;
                                                return (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        className={`time-slot ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                                                        disabled={isOccupied}
                                                        onClick={() => handleTimeSelect(time)}
                                                    >
                                                        {time}
                                                        {isOccupied && <span className="occupied-badge">Ocupado</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">3. Tu WhatsApp</label>
                                        <input 
                                            type="tel" id="phone" name="phone" 
                                            value={formData.phone} onChange={handleChange} 
                                            required placeholder="+34 600 000 000" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre</label>
                                        <input 
                                            type="text" id="name" name="name" 
                                            value={formData.name} onChange={handleChange} 
                                            required placeholder="Tu nombre" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" id="email" name="email" 
                                            value={formData.email} onChange={handleChange} 
                                            required placeholder="tu@email.com" 
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="notes">Notas (opcional)</label>
                                    <textarea 
                                        id="notes" name="notes" 
                                        value={formData.notes} onChange={handleChange} 
                                        placeholder="Cuéntanos qué necesitas..."
                                        rows="3"
                                    ></textarea>
                                </div>
                                
                                {error && <div className="error-message">{error}</div>}
                                
                                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                                    {loading ? 'Procesando...' : 'Confirmar Cita'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            <style>
                {`
                .booking-page .page-header {
                    background: #111;
                    color: white;
                    padding: 60px 0;
                    text-align: center;
                }
                .booking-container {
                    max-width: 800px;
                    margin: -30px auto 0;
                }
                .booking-form-wrapper {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    border: 1px solid #eee;
                }
                .calendar-widget {
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    font-weight: 700;
                }
                .calendar-header button {
                    background: #f5f5f5;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .calendar-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-size: 0.8rem;
                    color: #888;
                    margin-bottom: 10px;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 5px;
                }
                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .calendar-day:hover:not(.empty) {
                    background: #f0f0f0;
                }
                .calendar-day.today {
                    color: var(--color-primary);
                    font-weight: 700;
                    text-decoration: underline;
                }
                .calendar-day.selected {
                    background: var(--color-primary);
                    color: white;
                }
                .calendar-day.past {
                    color: #ddd;
                    cursor: not-allowed;
                    text-decoration: none;
                }
                .selected-date-text {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 20px;
                }
                .time-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .time-slot {
                    padding: 12px 5px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .time-slot:hover:not(:disabled) {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                    background: #fdf8f3;
                }
                .time-slot.selected {
                    background: var(--color-primary);
                    border-color: var(--color-primary);
                    color: white;
                }
                .time-slot.occupied {
                    background: #f5f5f5;
                    border-color: #eee;
                    color: #ccc;
                    cursor: not-allowed;
                    position: relative;
                }
                .occupied-badge {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    background: #eee;
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #999;
                }
                .hint-text, .loading-text {
                    font-size: 0.9rem;
                    color: #888;
                    padding: 20px;
                    text-align: center;
                    background: #fafafa;
                    border-radius: 8px;
                    border: 1px dashed #ddd;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                }
                .btn-whatsapp {
                    background: #25D366;
                    color: white;
                    display: block;
                    margin-bottom: 10px;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: 700;
                }
                .success-card {
                    text-align: center;
                    padding: 40px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }
                @media (max-width: 600px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
                `}
            </style>
        </div>
    );
}

export default BookingPage;
