import { useState } from 'react';
import { contactService } from '../services/api';

function Contacto() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await contactService.send(formData);
            setStatus({
                type: 'success',
                message: '¡Mensaje enviado correctamente! Te responderemos pronto.'
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Contacto</h1>
                    <p className="hero-subtitle">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject" className="form-label">Asunto</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                className="form-input"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Mensaje</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-textarea"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {status.message && (
                            <div
                                style={{
                                    padding: 'var(--spacing-md)',
                                    marginBottom: 'var(--spacing-md)',
                                    borderRadius: '8px',
                                    backgroundColor: status.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                                    color: status.type === 'success' ? '#065F46' : '#991B1B'
                                }}
                            >
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Enviando...' : 'Enviar Mensaje'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Contacto;
