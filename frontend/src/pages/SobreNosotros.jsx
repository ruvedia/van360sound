function SobreNosotros() {
    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Sobre Nosotros</h1>
                    <p className="hero-subtitle">
                        Expertos en audio dedicados a ayudarte a encontrar los auriculares perfectos
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ lineHeight: '1.8' }}>
                        <h2>Nuestra Misión</h2>
                        <p>
                            En Van360Sound, nuestra misión es simple: ayudarte a encontrar los auriculares
                            perfectos para tus necesidades. Ya sea que busques cancelación de ruido para
                            tus viajes, auriculares deportivos para el gimnasio, o equipos audiófilo de
                            alta fidelidad, estamos aquí para guiarte.
                        </p>

                        <h2 style={{ marginTop: 'var(--spacing-2xl)' }}>¿Qué Hacemos?</h2>
                        <p>
                            Realizamos análisis exhaustivos y profesionales de los últimos auriculares del
                            mercado. Nuestro equipo de expertos prueba cada producto en condiciones reales,
                            evaluando calidad de sonido, comodidad, duración de batería y relación calidad-precio.
                        </p>

                        <h2 style={{ marginTop: 'var(--spacing-2xl)' }}>Nuestros Valores</h2>
                        <ul style={{ marginLeft: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            <li><strong>Honestidad:</strong> Reviews imparciales y honestas</li>
                            <li><strong>Experiencia:</strong> Años de experiencia en audio profesional</li>
                            <li><strong>Actualización:</strong> Siempre al día con las últimas novedades</li>
                            <li><strong>Comunidad:</strong> Escuchamos a nuestros lectores</li>
                        </ul>

                        <h2 style={{ marginTop: 'var(--spacing-2xl)' }}>Contacta con Nosotros</h2>
                        <p>
                            ¿Tienes alguna pregunta o sugerencia? No dudes en{' '}
                            <a href="/contacto" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>
                                contactarnos
                            </a>
                            . Nos encanta escuchar a nuestra comunidad.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SobreNosotros;
