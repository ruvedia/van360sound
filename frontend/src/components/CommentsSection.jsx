import { useState, useEffect } from 'react';
import { commentService } from '../services/api';

function CommentsSection({ categorySlug }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState({ author_name: '', author_email: '', content: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    // Cargar comentarios al montar el componente
    useEffect(() => {
        loadComments();
    }, [categorySlug]);

    const loadComments = async () => {
        try {
            const response = await commentService.getByCategory(categorySlug);
            // La API devuelve los datos paginados en 'results'
            setComments(response.data.results || response.data || []);
        } catch (error) {
            console.error('Error loading comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.author_name || !newComment.content) {
            setMessage({ type: 'error', text: 'Por favor completa los campos obligatorios' });
            return;
        }

        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            // Enviar comentario con category_slug
            const response = await commentService.create({
                category_slug: categorySlug,
                author_name: newComment.author_name,
                author_email: newComment.author_email || null,
                content: newComment.content
            });

            setMessage({ type: 'success', text: '¡Comentario publicado correctamente!' });
            setNewComment({ author_name: '', author_email: '', content: '' });

            // Recargar comentarios
            await loadComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
            setMessage({ type: 'error', text: 'Error al publicar el comentario. Inténtalo de nuevo.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div>Cargando comentarios...</div>;
    }

    return (
        <div className="comments-section" style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Comentarios</h3>

            {/* Mensaje de éxito/error */}
            {message.text && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Formulario de comentarios */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={newComment.author_name}
                        onChange={(e) => setNewComment({ ...newComment, author_name: e.target.value })}
                        required
                        disabled={submitting}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Email (opcional)
                    </label>
                    <input
                        type="email"
                        value={newComment.author_email}
                        onChange={(e) => setNewComment({ ...newComment, author_email: e.target.value })}
                        disabled={submitting}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Comentario *
                    </label>
                    <textarea
                        value={newComment.content}
                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                        required
                        disabled={submitting}
                        rows="5"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ padding: '0.9rem 2rem', fontSize: '1rem', opacity: submitting ? 0.6 : 1 }}
                >
                    {submitting ? 'Publicando...' : 'Publicar Comentario'}
                </button>
            </form>

            {/* Lista de comentarios */}
            {comments.length > 0 ? (
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                        {comments.length} {comments.length === 1 ? 'Comentario' : 'Comentarios'}
                    </h4>
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            style={{
                                padding: '1.5rem',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <strong style={{ fontSize: '1.1rem' }}>{comment.author_name}</strong>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                    {new Date(comment.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <p style={{ lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
                    Sé el primero en comentar sobre este ranking
                </p>
            )}
        </div>
    );
}

export default CommentsSection;
