const SCORE_DEFINITIONS = [
    { title: "Escenario Sonoro", content: "Se refiere a la sensación de espacio y amplitud del sonido. Un buen escenario sonoro hace que la música no suene “encerrada en la cabeza”, sino que los instrumentos parezcan colocados a distintas distancias y posiciones." },
    { title: "Confort", content: "Indica qué tan cómodos son los auriculares durante sesiones largas. Depende del peso, la presión de la diadema, la forma de las almohadillas y los materiales en contacto con la cabeza y las orejas." },
    { title: "Calidad de Construcción", content: "Evalúa los materiales y la robustez del producto. Incluye plásticos, metal, cuero, bisagras y la sensación general de durabilidad y acabado premium." },
    { title: "Agudos", content: "Son las frecuencias altas del sonido, responsables del brillo, el detalle y la claridad. Unos buenos agudos aportan definición sin resultar estridentes ni cansar el oído." },
    { title: "Medios", content: "Corresponden a las frecuencias centrales, donde se sitúan principalmente las voces e instrumentos como guitarras o pianos. Unos medios bien afinados hacen que las voces suenen naturales y realistas." },
    { title: "Graves", content: "Son las frecuencias bajas, responsables del impacto, la profundidad y la sensación de potencia. Un buen grave debe ser contundente pero controlado, sin tapar el resto del sonido." },
    { title: "Precisión Acústica", content: "Mide qué tan fiel es el sonido respecto a la grabación original. Cuanta más precisión acústica, menos coloración artificial y mayor sensación de audio realista y equilibrado." },
    { title: "Valor / Precio", content: "Relaciona el rendimiento general con el precio del producto. Un auricular con buen valor/precio ofrece muchas prestaciones y calidad por lo que cuesta, incluso frente a modelos más caros." },
    { title: "Cancelación Activa de Ruido (ANC)", content: "Es la capacidad de los auriculares para reducir el ruido exterior mediante micrófonos y procesamiento digital. Un buen ANC atenúa sonidos como motores, tráfico o conversaciones, mejorando la experiencia en viajes y entornos ruidosos." },
    { title: "Modo Transparencia", content: "Permite escuchar el entorno sin quitarse los auriculares, utilizando los micrófonos para amplificar los sonidos exteriores. Un buen modo transparencia suena natural, sin ruido de fondo excesivo ni voces robóticas." },
    { title: "Calidad de Llamadas", content: "Evalúa la claridad con la que se transmite la voz en llamadas telefónicas o videollamadas. Tiene en cuenta la reducción de ruido ambiental, la nitidez de la voz y la estabilidad de la conexión." }
];

const HIFI_DATA = {
    seoTitle: "Mejores Auriculares Hi-Fi 2026: Ranking para Audiófilos | Van360Sound",
    metaDescription: "Descubre el ranking definitivo de los mejores auriculares de alta fidelidad (Hi-Fi) del 2026. Análisis detallado, especificaciones técnicas y comparativas para audiófilos.",
    introData: [
        { type: 'subtitle', content: '¿Qué define realmente al "Sonido Hi-Fi"?' },
        { type: 'paragraph', content: 'Hi-Fi (Alta Fidelidad) busca la transparencia total: que la música suene exactamente como se grabó, sin añadir graves artificiales ni distorsión. Es escuchar la "verdad" de la canción.' },
        { type: 'subtitle', content: '¿Es necesario ser un experto para notarlo?' },
        { type: 'paragraph', content: 'No. Cualquiera puede notar la diferencia inmediatamente. Es como ponerse unas gafas graduadas por primera vez: de repente, todo tiene contornos definidos y detalles que antes eran borrosos.' },
        { type: 'subtitle', content: '¿Por qué el rango de precios es tan amplio?' },
        { type: 'paragraph', content: 'El precio escala con la precisión de los materiales (drivers de berilio, carcasas de madera) y la ingeniería. Sin embargo, nuestro Top 5 demuestra que hoy existen opciones increíbles sin hipotecar la casa.' },
        { type: 'paragraph', content: 'Bienvenidos a la selección definitiva de los <strong>5 Mejores Auriculares Hi-Fi de 2026</strong>. Este año, la alta fidelidad ha dejado de ser un lujo exclusivo para convertirse en una experiencia accesible y transformadora. Hemos probado decenas de modelos en busca de esa pureza sonora que eriza la piel: desde la calidez de las válvulas hasta la precisión de los drivers modernos. Si buscas redescubrir tu música favorita con un detalle que nunca imaginaste, este ranking es tu punto de partida.' }
    ],
    definitionsData: SCORE_DEFINITIONS,
    outroData: [
        { type: 'subtitle', content: 'Preguntas Frecuentes sobre Audio Hi-Fi' },
        { type: 'subtitle', content: '¿Realmente se nota la diferencia con unos auriculares normales?' },
        { type: 'paragraph', content: 'Absolutamente. Los auriculares de consumo suelen "colorear" el sonido (muchos graves, pocos medios) para que suene "divertido". El Hi-Fi busca la fidelidad: revelar capas ocultas, instrumentos que no sabías que estaban ahí y la respiración del cantante. Es como pasar de ver una película en VHS a 4K.' },
        { type: 'subtitle', content: '¿Necesito un amplificador para usarlos?' },
        { type: 'paragraph', content: 'No siempre. Muchos modelos actuales son de "baja impedancia" (32 ohms o menos), lo que significa que suenan genial conectados directamente al móvil o PC. Sin embargo, los modelos más exigentes (más de 80-250 ohms) sí agradecen un pequeño amplificador/DAC para sacarles el 100% de brillo y volumen.' },
        { type: 'subtitle', content: '¿Son cómodos para usar todo el día?' },
        { type: 'paragraph', content: 'La comodidad es una prioridad en el Hi-Fi. A diferencia de los modelos de moda, estos están hechos con materiales como terciopelo, cuero auténtico y espumas con memoria, pensados para sesiones de escucha de 4 o 5 horas sin fatiga.' },
        { type: 'subtitle', content: '¿Abiertos o Cerrados? ¿Cuál elijo?' },
        { type: 'paragraph', content: 'Los **abiertos** tienen rejillas que dejan pasar el aire; crean una sensación de "escenario" increíble (como si la música flotara a tu alrededor) pero no aíslan nada. Los **cerrados** te aíslan del ruido exterior y tienen graves más potentes, pero la escena sonora es más íntima ("dentro de tu cabeza").' }
    ]
};

const NOISE_CANCELLING_DATA = {
    seoTitle: "Mejores Auriculares Noise Cancelling 2026: Ranking Cancelación de Ruido | Van360Sound",
    metaDescription: "Comparativa de los 5 mejores auriculares con cancelación de ruido activa (ANC) del 2026. ¡Encuentra el silencio perfecto!",
    introData: [
        { type: 'subtitle', content: '¿Qué tecnología usan estos modelos?' },
        { type: 'paragraph', content: 'Usan "Cancelación Activa Híbrida": micrófonos dentro y fuera del auricular que escuchan el ruido y lo borran milisegundos antes de que llegue a tu tímpano.' },
        { type: 'subtitle', content: '¿Me aislarán de todo el ruido?' },
        { type: 'paragraph', content: 'Casi. Son mágicos con sonidos constantes (motores de avión, metro, aire acondicionado), reduciéndolos hasta un 95%. Las voces humanas agudas son más difíciles, pero se atenúan mucho.' },
        { type: 'subtitle', content: '¿Afecta la cancelación a la calidad de la música?' },
        { type: 'paragraph', content: 'En los modelos antiguos sí, pero en este Top 5 la tecnología es tan avanzada que la pérdida de calidad es imperceptible. Disfrutarás de un sonido puro en total silencio.' },
        { type: 'paragraph', content: 'El silencio es el nuevo lujo, y nuestro <strong>Top 5 de Auriculares con Cancelación de Ruido en 2026</strong> reúne a los maestros del aislamiento. Ya no se trata solo de bloquear el ruido del avión; los modelos de este año utilizan IA para filtrar voces y sonidos repentinos sin afectar la calidad de tu música. Hemos analizado qué tan bien te aíslan del mundo y, lo más importante, cómo suenan cuando lo hacen.' }
    ],
    definitionsData: SCORE_DEFINITIONS,
    outroData: [
        { type: 'subtitle', content: 'Dudas Comunes sobre Cancelación de Ruido (ANC)' },
        { type: 'subtitle', content: '¿La cancelación de ruido daña el oído?' },
        { type: 'paragraph', content: 'Es un mito común. La ANC no emite radiación ni presión dañina; simplemente genera ondas sonoras inversas para anular el ruido. De hecho, ayuda a proteger tus oídos porque te permite escuchar música a volúmenes más bajos en entornos ruidosos, reduciendo la fatiga auditiva.' },
        { type: 'subtitle', content: '¿Puedo usarlos solo para silenciar el mundo, sin música?' },
        { type: 'paragraph', content: 'Sí, y es una función fantástica. Muchos usuarios los utilizan simplemente para concentrarse en la oficina, estudiar o dormir en un viaje. Al activarlos sin música, notarás cómo el zumbido de fondo desaparece casi por completo.' },
        { type: 'subtitle', content: '¿Cuánto dura la batería utilizando ANC?' },
        { type: 'paragraph', content: 'Hace años era un problema, pero en 2026 el estándar ha subido enormemente. La mayoría de los modelos de nuestro top ofrecen más de 25-30 horas con la cancelación activada, suficiente para volar de Madrid a Tokio ida y vuelta sin cargar.' },
        { type: 'subtitle', content: '¿Qué es el "Modo Transparencia"?' },
        { type: 'paragraph', content: 'Es lo opuesto a cancelar ruido. Los micrófonos captan el sonido exterior y lo amplifican hacia tus oídos. Es vital para la seguridad al cruzar calles o para tener una conversación rápida sin necesidad de quitarte los auriculares.' }
    ]
};

const TRUE_WIRELESS_DATA = {
    seoTitle: "Mejores Auriculares True Wireless 2026: Ranking TWS e Inalámbricos | Van360Sound",
    metaDescription: "Ranking Top 5 de los mejores auriculares True Wireless (TWS) del 2026. Sony, Apple, Bose y Samsung analizados por expertos en audio.",
    introData: [
        { type: 'subtitle', content: '¿Qué tal suenan comparados con los de cable?' },
        { type: 'paragraph', content: 'Sorprendentemente bien. Gracias a códecs como LDAC o aptX, la brecha se ha cerrado casi por completo. Para el 99% de los usuarios, la diferencia es indistinguible.' },
        { type: 'subtitle', content: '¿La batería es un problema real?' },
        { type: 'paragraph', content: 'Ya no. Con estuches de carga rápida que te dan horas de uso en minutos, la ansiedad por la batería es cosa del pasado. Todos los modelos de la lista aguantan un día entero de uso mixto.' },
        { type: 'subtitle', content: '¿Son seguros para la salud auditiva?' },
        { type: 'paragraph', content: 'Sí, y de hecho ayudan. Al aislar bien (pasiva o activamente), no necesitas subir el volumen al máximo para escuchar tu música en la calle, protegiendo tus oídos a largo plazo.' },
        { type: 'paragraph', content: 'La libertad nunca sonó tan bien. En nuestro ranking de los <strong>Mejores Auriculares True Wireless de 2026</strong>, verás cómo los cables han pasado a la historia sin sacrificar calidad. Desde estuches que caben en el bolsillo pequeño hasta baterías que duran semanas, estos 5 modelos representan la cúspide de la tecnología portátil. Ideales para el día a día, el metro o la oficina, sin ataduras.' }
    ],
    definitionsData: SCORE_DEFINITIONS,
    outroData: [
        { type: 'subtitle', content: 'Guía Rápida para True Wireless (TWS)' },
        { type: 'subtitle', content: '¿Se caen fácilmente de la oreja?' },
        { type: 'paragraph', content: 'Los diseños modernos han mejorado mucho la ergonomía. La clave es elegir el tamaño correcto de las almohadillas (normalmente vienen S, M, L). Si consiguen un buen sellado, se mantendrán firmes incluso andando rápido. Para correr, busca modelos específicos de deporte.' },
        { type: 'subtitle', content: '¿Puedo usar solo uno mientras el otro carga?' },
        { type: 'paragraph', content: 'Sí, la mayoría de los modelos de nuestro ranking permiten el uso "Mono". Puedes llevar solo el derecho o el izquierdo para llamadas o podcasts mientras el otro se queda en el estuche cargando, duplicando efectivamente la autonomía total.' },
        { type: 'subtitle', content: '¿Qué pasa si se mojan o sudo?' },
        { type: 'paragraph', content: 'Revisa la certificación IPX. IPX4 aguanta sudor y lluvia ligera (perfecto para uso diario). IPX7 o superior aguantaría una inmersión accidental. Nunca metas el estuche de carga en agua, ya que normalmente no es resistente.' },
        { type: 'subtitle', content: '¿Son buenos para hacer llamadas?' },
        { type: 'paragraph', content: 'Ha sido el gran avance de 2026. Los modelos top usan "beamforming" (micrófonos que apuntan a tu boca) y algoritmos de IA para eliminar el viento y el ruido de fondo, haciendo que tu voz suene clara incluso en la calle.' }
    ]
};

const SPORT_DATA = {
    seoTitle: "Mejores Auriculares Deportivos 2026: Ranking Auriculares Running y Gym | Van360Sound",
    metaDescription: "¿Buscas auriculares para correr o entrenar? Ranking de los 5 mejores auriculares deportivos del 2026. Resistentes al sudor y ajuste seguro.",
    introData: [
        { type: 'subtitle', content: '¿Por qué no usar mis auriculares normales?' },
        { type: 'paragraph', content: 'El sudor es corrosivo. Un auricular normal morirá en semanas. Los deportivos están sellados internamente para resistir la humedad, la lluvia y el polvo del camino.' },
        { type: 'subtitle', content: '¿Qué ajuste es el mejor para mí?' },
        { type: 'paragraph', content: 'Si haces HIIT o CrossFit, busca "aletas" o ganchos. Si solo haces pesas o elíptica, un buen ajuste in-ear (tapón) suele ser suficiente y más cómodo.' },
        { type: 'subtitle', content: '¿Escucharé los coches si salgo a correr?' },
        { type: 'paragraph', content: 'Es un punto clave. Muchos modelos incluyen "Modo Ambiente" para dejar pasar el sonido del tráfico, o usan diseños abiertos (como los de conducción ósea) para máxima seguridad vial.' },
        { type: 'paragraph', content: 'Entrenar sin música no es lo mismo. Presentamos el <strong>Top 5 de Auriculares Deportivos de 2026</strong>, diseñados para resistir tu ritmo, tu sudor y tu movimiento. Hemos buscado modelos que se mantengan en su sitio hagas lo que hagas (burpees, sprints, escalada) y que te motiven con graves potentes. Aquí encontrarás a tus nuevos compañeros de gimnasio indestructibles.' }
    ],
    definitionsData: SCORE_DEFINITIONS,
    outroData: [
        { type: 'subtitle', content: 'Lo que debes saber sobre Auriculares Deportivos' },
        { type: 'subtitle', content: '¿Qué significa la certificación IP68?' },
        { type: 'paragraph', content: 'Es el estándar de oro en resistencia. El "6" significa que es totalmente estanco al polvo (arena, magnesio del gym). El "8" significa que puedes sumergirlos en agua continuamente. Si sudas mucho o corres bajo la lluvia, busca mínimo IPX4. Para nadar, necesitas IPX8.' },
        { type: 'subtitle', content: '¿Son mejores con gancho o de botón?' },
        { type: 'paragraph', content: 'Para actividades de alto impacto (CrossFit, Trail Running), los modelos con **gancho** alrededor de la oreja ofrecen una seguridad imbatible; es imposible que se caigan. Los de **botón con aleta** son más discretos y ligeros, ideales para gimnasio convencional o running urbano.' },
        { type: 'subtitle', content: '¿Qué opinan de la conducción ósea para correr?' },
        { type: 'paragraph', content: 'Son la opción más segura para corredores urbanos y ciclistas. Al no tapar el oído, escuchas el tráfico perfectamente. No tienen la calidad de graves de un in-ear, pero ganan en seguridad y comodidad al no presionar dentro de la oreja.' },
        { type: 'subtitle', content: '¿Cómo los limpio después de sudar?' },
        { type: 'paragraph', content: 'Es vital para que duren. Pásales un paño húmedo (solo agua o alcohol muy diluido) por los contactos de carga y las almohadillas después de cada sesión. La sal del sudor es el enemigo número uno de los conectores de carga.' }
    ]
};

const GAMING_DATA = {
    seoTitle: "Mejores Auriculares Gaming 2026: Ranking Headsets PC, PS5 y Xbox | Van360Sound",
    metaDescription: "Ranking Top 5 auriculares gaming del 2026. Audio espacial, micrófonos cristalinos y la mejor latencia para ganar tus partidas.",
    introData: [
        { type: 'subtitle', content: '¿Qué es el "Audio Espacial" o 360?' },
        { type: 'paragraph', content: 'Es un procesamiento que simula sonido envolvente en stereo. Te permite escuchar si un paso viene de "arriba a la izquierda" o "detrás a la derecha", vital para juegos competitivos.' },
        { type: 'subtitle', content: '¿El micrófono es importante si no hago streaming?' },
        { type: 'paragraph', content: 'Crucial. Un mal micro frustra a tus compañeros de equipo con ruidos de teclado y estática. Un buen micro aísla tu voz para una comunicación táctica limpia.' },
        { type: 'subtitle', content: '¿Son cómodos para jugar 6 horas seguidas?' },
        { type: 'paragraph', content: 'Están diseñados específicamente para eso. Usan diademas de suspensión y almohadillas transpirables que distribuyen el peso mejor que cualquier auricular musical convencional.' },
        { type: 'paragraph', content: 'En el campo de batalla virtual, el sonido es información. Nuestro <strong>Ranking de los 5 Mejores Auriculares Gaming de 2026</strong> está pensado para darte ventaja competitiva. Pasos enemigos, recargas lejanas y explosiones inmersivas; estos headsets ofrecen un posicionamiento 3D letal y micrófonos tan claros que parecerá que estás en la misma habitación que tu escuadrón.' }
    ],
    definitionsData: SCORE_DEFINITIONS,
    outroData: [
        { type: 'subtitle', content: 'Claves para elegir Headset Gaming' },
        { type: 'subtitle', content: '¿Los inalámbricos tienen retraso (lag)?' },
        { type: 'paragraph', content: 'Los auriculares Bluetooth normales, sí. Pero los auriculares gaming usan conexión **2.4GHz** (con un pincho USB). Esta tecnología es tan rápida como el cable (latencia < 20ms), por lo que verás el disparo y escucharás el sonido al instante. No hay desventaja competitiva hoy en día.' },
        { type: 'subtitle', content: '¿Sirven también para escuchar música?' },
        { type: 'paragraph', content: 'Sí, pero suelen venir ecualizados para resaltar pasos y disparos (agudos y graves). Busca modelos que tengan software para cambiar el perfil de ecualización a "Música" o "Cine", o que tengan un perfil de sonido más "plano" y natural.' },
        { type: 'subtitle', content: '¿Almohadillas de piel o de tela?' },
        { type: 'paragraph', content: 'La **piel sintética** aísla mejor del ruido exterior y mejora los graves, pero da más calor en verano. La **tela deportiva** transpirable es mucho más fresca para sesiones largas, pero deja escapar un poco más de sonido. Tú eliges según tu temperatura ambiente.' },
        { type: 'subtitle', content: '¿Necesito comprar una tarjeta de sonido?' },
        { type: 'paragraph', content: 'Con los modelos de nuestro ranking, no. La mayoría son USB o inalámbricos, lo que significa que llevan su propia mini-tarjeta de sonido (DAC) integrada de alta calidad. Solo enchufar y disfrutar del mejor audio.' }
    ]
};

const IN_EAR_DATA = {
    seoTitle: "Mejores Auriculares In-Ear (IEMs) 2026: Ranking Audiófilo | Van360Sound",
    metaDescription: "Guía de los mejores monitores intraurales (IEMs) del 2026. Calidad de estudio en tus oídos. Ranking detallado por expertos.",
    introData: [
        { type: 'subtitle', content: '¿En qué se diferencian de los auriculares "de botón" normales?' },
        { type: 'paragraph', content: 'Los IEMs (In-Ear Monitors) se insertan más profundamente para sellar el canal auditivo. Esto crea una cámara acústica perfecta donde los graves retumban y los detalles brillan sin interferencias externas.' },
        { type: 'subtitle', content: '¿Son solo para profesionales de la música?' },
        { type: 'paragraph', content: 'Nacieron para músicos en escenario, pero hoy son adorados por cualquiera que quiera escuchar música con calidad de estudio en el metro o caminando. No necesitas ser técnico de sonido para disfrutarlos.' },
        { type: 'subtitle', content: '¿El cable es una ventaja o desventaja?' },
        { type: 'paragraph', content: 'En audio puro, es una ventaja. Cero latencia, cero compresión de datos y nunca se quedan sin batería. Además, si se rompe el cable, lo cambias por otro, haciendo que el auricular dure décadas.' },
        { type: 'paragraph', content: 'Potencia de estudio en el tamaño de una canica. Este es el <strong>Top 5 de Monitores In-Ear (IEMs) de 2026</strong> para quienes exigen la máxima fidelidad en formato portátil. Alejados del marketing masivo, estos modelos son joyas de la ingeniería acústica, capaces de separar instrumentos con una precisión quirúrgica. Prepárate para escuchar detalles en tus canciones que llevaban años ahí escondidos.' }
    ],
    definitionsData: SCORE_DEFINITIONS,
    outroData: [
        { type: 'subtitle', content: 'In-Ear Monitors (IEM) explicados' },
        { type: 'subtitle', content: '¿Qué son los "Drivers" y por qué tienen varios?' },
        { type: 'paragraph', content: 'El driver es el mini-altavoz interno. Los IEMs avanzados suelen usar varios (ej: 4 o 5 por oído) para repartirse el trabajo: uno para graves, otro para medios, otro para agudos. Esto consigue una separación de instrumentos y una claridad difícil de lograr con un solo altavoz.' },
        { type: 'subtitle', content: '¿Por qué el cable va por detrás de la oreja?' },
        { type: 'paragraph', content: 'Tiene dos funciones: primero, sujeta el auricular firmemente para que no se mueva. Segundo, reduce el "ruido microfónico" (el sonido de roce que se escucha cuando el cable toca tu ropa), permitiendo una escucha mucho más limpia en movimiento.' },
        { type: 'subtitle', content: '¿Aíslan bien el ruido sin tener ANC?' },
        { type: 'paragraph', content: 'Sorprendentemente bien. Al insertarse dentro del canal auditivo como un tapón, ofrecen un **aislamiento pasivo** excelente (a veces bloquean más decibelios que la cancelación activa). Son perfectos para escenarios o transporte público sin necesitar baterías.' },
        { type: 'subtitle', content: '¿Necesito un aparato extra (DAC) para usarlos?' },
        { type: 'paragraph', content: 'Para los modelos de gama alta, es muy recomendable. Un pequeño "dongle" USB-C (DAC portátil) limpiará la señal de tu móvil y le dará la potencia necesaria. Aunque sonarán si los conectas directo, un buen DAC es lo que hace que pasen de sonar "bien" a sonar "increíble".' }
    ]
};

export const rankings = {
    // Categorías originales (por compatibilidad)
    'hifi': HIFI_DATA,
    'noise-cancelling': NOISE_CANCELLING_DATA,
    'true-wireless': TRUE_WIRELESS_DATA,
    'sport': SPORT_DATA,
    'gaming': GAMING_DATA,
    'in-ear': IN_EAR_DATA,

    // Nuevas Categorías (mapeadas desde Django Slugs)
    'hi-fi': HIFI_DATA,
    'headphones-gaming': GAMING_DATA,
    'headphones-sport': SPORT_DATA,
    'headphones-anc': NOISE_CANCELLING_DATA,
    'true-wireless-anc': NOISE_CANCELLING_DATA, // Priorizamos el concepto ANC
    'true-wireless-hi-fi': HIFI_DATA,
    'headphones-anc-hi-fi': HIFI_DATA,
    'true-wireless-anc-hi-fi': HIFI_DATA, // Combinación, priorizamos HIFI por calidad
    'true-wireless-sport': SPORT_DATA,
    'true-wireless-gaming': GAMING_DATA,
    'auriculares-deportivos-true-wireless-cerrados': SPORT_DATA
};
