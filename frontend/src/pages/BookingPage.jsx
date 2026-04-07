import { useState } from 'react';
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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${API_BASE_URL}/bookings/`, formData);
            setSuccess(true);
            
            // Generar enlace de WhatsApp
            const message = `Hola, he solicitado una cita en Van360Sound.%0A%0ADatos:%0A- Nombre: ${formData.name}%0A- Fecha: ${formData.date}%0A- Hora: ${formData.time}%0A- Notas: ${formData.notes || 'Ninguna'}`;
            const whatsappUrl = `https://wa.me/34680879684?text=${message}`; // He puesto un número de ejemplo, el usuario debe cambiarlo
            
            // Redirigir opcionalmente o mostrar el botón
            window.sessionStorage.setItem('whatsappUrl', whatsappUrl);
            
        } catch (err) {
            console.error('Error creating booking:', err);
            setError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-page">
            <Helmet>
                <title>Reservar Cita | Van360Sound</title>
                <meta name="description" content="Reserva una cita con nuestros expertos en audio para asesoramiento personalizado." />
            </Helmet>

            <header className="page-header">
                <div className="container">
                    <h1>Asesoramiento Personalizado</h1>
                    <p>Reserva una sesión con nuestros expertos para encontrar tu sonido ideal.</p>
                </div>
            </header>

            <section className="booking-content container section-padding">
                <div className="booking-container">
                    {success ? (
                        <div className="success-card">
                            <div className="success-icon">✅</div>
                            <h2>¡Cita Solicitada con Éxito!</h2>
                            <p>Hemos recibido tu solicitud. Te confirmaremos por email en breve.</p>
                            <p>También puedes enviarnos un mensaje directo por WhatsApp para agilizar la confirmación:</p>
                            <a 
                                href={window.sessionStorage.getItem('whatsappUrl')} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp"
                            >
                                Enviar Confirmación por WhatsApp
                            </a>
                            <button className="btn btn-secondary" onClick={() => setSuccess(false)}>Solicitar otra cita</button>
                        </div>
                    ) : (
                        <div className="booking-form-wrapper">
                            <form onSubmit={handleSubmit} className="booking-form">
                                <div className="form-group">
                                    <label htmlFor="name">Nombre Completo</label>
                                    <input 
                                        type="text" id="name" name="name" 
                                        value={formData.name} onChange={handleChange} 
                                        required placeholder="Tu nombre" 
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" id="email" name="email" 
                                            value={formData.email} onChange={handleChange} 
                                            required placeholder="tu@email.com" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">WhatsApp / Teléfono</label>
                                        <input 
                                            type="tel" id="phone" name="phone" 
                                            value={formData.phone} onChange={handleChange} 
                                            required placeholder="+34 600 000 000" 
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="date">Fecha</label>
                                        <input 
                                            type="date" id="date" name="date" 
                                            value={formData.date} onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="time">Hora</label>
                                        <input 
                                            type="time" id="time" name="time" 
                                            value={formData.time} onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Notas o Consultas</label>
                                    <textarea 
                                        id="notes" name="notes" 
                                        value={formData.notes} onChange={handleChange} 
                                        placeholder="¿En qué podemos ayudarte?"
                                        rows="4"
                                    ></textarea>
                                </div>
                                
                                {error && <div className="error-message">{error}</div>}
                                
                                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                                    {loading ? 'Procesando...' : 'Solicitar Reserva'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            <style>
                {`
                .booking-page .page-header {
                    background: linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%);
                    color: white;
                    padding: 80px 0;
                    text-align: center;
                }
                .booking-container {
                    max-width: 700px;
                    margin: 0 auto;
                }
                .booking-form-wrapper {
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid var(--color-border);
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
                    color: var(--color-text);
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    font-size: 1rem;
                }
                .btn-whatsapp {
                    background: #25D366;
                    color: white;
                    margin-bottom: 15px;
                    display: block;
                    width: 100%;
                    padding: 15px;
                    border-radius: 10px;
                    font-weight: 700;
                    text-align: center;
                }
                .btn-whatsapp:hover {
                    background: #128C7E;
                    color: white;
                }
                .success-card {
                    background: white;
                    padding: 50px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .success-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
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
