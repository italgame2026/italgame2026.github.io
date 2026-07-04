"use strict";

// ── Misiones (game.js líneas 87–953) ──
// Todas las 20 misiones están inline en game.js.
// No existen misionesContinued1, misionesContinued2 ni misiones.push(...).
const missions = [
  {
    id: "caffe", level: "A1", place: "Caffetteria", npc: "Barista Sofia",
    pos: { x: 8.2, z: -9.4 }, color: "#c76f45",
    cefr: "A1", skill: "interaction", canDo: "Pedir una bebida en un cafe",
    grammar: ["vorrei + sustantivo", "articulo indeterminado un/una"],
    vocabTargets: ["caffè", "ristretto", "cornetto", "Buongiorno", "Grazie"],
    communicativeFunction: "ordering",
    errorTypes: ["formality", "interference"],
    prerequisites: [],
    greeting: {
      it: "Buongiorno! Benvenuto al Caffè della Piazza. Cosa posso portarti oggi?",
      es: "¡Buenos días! Bienvenido al Café de la Plaza. ¿Qué puedo traerte hoy?"
    },
    vocab: [
      { it: "Buongiorno", es: "Buenos dias" },
      { it: "Vorrei", es: "Quisiera" },
      { it: "Per favore", es: "Por favor" },
      { it: "Grazie", es: "Gracias" },
      { it: "Quanto costa?", es: "Cuanto cuesta?" }
    ],
    dialogue: [
      {
        prompt: "Buongiorno! Cosa desidera?",
        hint: "La barista te saluda y pregunta que deseas.",
        choices: ["Vorrei un caffè, per favore.", "Voglio un caffè, per piacere.", "Desidero un caffè, per favore."],
        correct: 0,
        explanation: "'Vorrei' (quisiera) + 'per favore' (por favor) es la forma educada estandar.",
        successLine: "Benissimo! Lungo o ristretto?",
        failureLine: "Scusi... non ho capito bene."
      },
      {
        prompt: "Lungo o ristretto?",
        hint: "Pregunta si lo quieres largo o corto.",
        choices: ["Ristretto, grazie.", "Corto, grazie.", "Piccolo, per favore."],
        correct: 0,
        explanation: "'Ristretto' es el termino correcto para cafe corto/concentrado en Italia.",
        successLine: "Perfetto! Vuole anche un cornetto?",
        failureLine: "Mmm... non è proprio così."
      },
      {
        prompt: "Sono due euro e cinquanta.",
        hint: "Te dice el precio: 2.50 euros.",
        choices: ["Ecco a Lei. Grazie!", "Ecco a te. Grazie!", "Ecco a Lei. Grazia!"],
        correct: 0,
        explanation: "'Ecco a Lei' es la forma formal de 'aqui tiene'. 'Grazie' (no 'Grazia') es gracias.",
        successLine: "Grazie a Lei! Buona giornata!",
        failureLine: "Come dice?"
      }
    ],
    success: "Sofia prepara un caffè perfetto. Ti senti el benvenuto in Italia.",
    failure: "Sofia cerca di capirti ma l'ordine esce confuso.",
    reward: { name: "Caffe", points: 15, color: "#6b3e1e" },
    failEvent: "badFood",
    progression: [
      {
        // Nivel 2
        greeting: {
          it: "Buongiorno! Di nuovo qui? Cosa desidera oggi?",
          es: "¡Buenos días! ¿De nuevo por aquí? ¿Qué desea hoy?"
        },
        dialogue: [
          {
            prompt: "Buongiorno! Di nuevo qui? Cosa desidera oggi?",
            hint: "La barista te saluda formalmente y pregunta qué deseas hoy.",
            choices: ["Vorrei un caffè, per favore.", "Voglio un caffè, per piacere.", "Dammi un caffè, per favore."],
            correct: 0,
            explanation: "'Vorrei' es el condicional de cortesía adecuado. 'Dammi' (dame) es demasiado informal.",
            successLine: "Benissimo! Lungo o ristretto?",
            failureLine: "Scusi... non ho capito bene."
          },
          {
            prompt: "Lungo o ristretto?",
            hint: "Pregunta si lo quieres largo o corto.",
            choices: ["Ristretto, grazie.", "Corto, grazie.", "Piccolo, per favore."],
            correct: 0,
            explanation: "'Ristretto' es el término italiano para café concentrado.",
            successLine: "Perfetto! Vuole anche un cornetto?",
            failureLine: "Mmm... non è proprio così."
          },
          {
            prompt: "Sono due euro e cinquanta.",
            hint: "Te dice el precio: 2.50 euros.",
            choices: ["Ecco a Lei. Grazie!", "Ecco a te. Grazie!", "Ecco a Lei. Grazia!"],
            correct: 0,
            explanation: "'Ecco a Lei' es la cortesía formal para 'aquí tiene'.",
            successLine: "Grazie a Lei! Buona giornata!",
            failureLine: "Come dice?"
          }
        ]
      },
      {
        // Nivel 3
        greeting: {
          it: "Buongiorno! Ormai sei un cliente fisso! Cosa ti preparo?",
          es: "¡Buenos días! ¡Ya eres un cliente habitual! ¿Qué te preparo?"
        },
        dialogue: [
          {
            prompt: "Buongiorno! Ormai sei un cliente fisso! Cosa ti preparo?",
            hint: "Usa registro informal porque ya te conoce. Responde con cortesía.",
            choices: ["Vorrei un espresso, per favore.", "Desidero un espresso, per piacere.", "Voglio un espresso, per favore."],
            correct: 0,
            explanation: "'Vorrei' sigue siendo la opción más educada.",
            successLine: "Ottimo! Al tavolo o al banco?",
            failureLine: "Prego?"
          },
          {
            prompt: "Al tavolo o al banco?",
            hint: "Pregunta si lo tomas en mesa o en barra.",
            choices: ["Al banco, grazie.", "In barra, grazie.", "Al tavolo, per favore."],
            correct: 0,
            explanation: "En barra es 'al banco' en italiano.",
            successLine: "Perfetto, ecco il caffè. Vuole lo scontrino?",
            failureLine: "Non capisco..."
          },
          {
            prompt: "Ecco il caffè. Vuole lo scontrino?",
            hint: "Te ofrece el recibo fiscal (scontrino).",
            choices: ["Sì, grazie. Lo scontrino, per favore.", "Sì, grazie. La ricevuta, per favore.", "No, grazie. Va bene così."],
            correct: 0,
            explanation: "'Lo scontrino' es el recibo fiscal impreso comercial en cafeterías.",
            successLine: "Ecco a Lei! Buona giornata!",
            failureLine: "Scusi?"
          }
        ]
      },
      {
        // Nivel 4
        greeting: {
          it: "Ciao! Il solito caffè o vuoi provare qualcosa di nuovo?",
          es: "¡Hola! ¿El café de siempre o quieres probar algo nuevo?"
        },
        dialogue: [
          {
            prompt: "Ciao! Il solito caffè o vuoi provare qualcosa di nuovo?",
            hint: "Te saluda de forma amigable y ofrece probar algo nuevo.",
            choices: ["Vorrei provare il ginseng, se possibile.", "Voglio provare il ginseng, per piacere.", "Desidero provare il ginseng, per favore."],
            correct: 0,
            explanation: "El café al ginseng es una alternativa popular en Italia.",
            successLine: "Ottima scelta! In tazza grande o piccola?",
            failureLine: "Come?"
          },
          {
            prompt: "In tazza grande o piccola?",
            hint: "Pregunta si lo quieres en taza grande o pequeña.",
            choices: ["In tazza piccola, grazie.", "En taza chica, per favore.", "Tazza grande, grazie."],
            correct: 0,
            explanation: "'In tazza piccola' es correcto para tamaño espresso.",
            successLine: "D'accordo! Gradisce dello zucchero o del miele?",
            failureLine: "Non capisco la dimensione..."
          },
          {
            prompt: "Gradisce dello zucchero o del miele?",
            hint: "Te ofrece endulzarlo con azúcar o miel.",
            choices: ["Zucchero di canna, per favore.", "Zucchero del cane, per favore.", "Miele del cane, per piacere."],
            correct: 0,
            explanation: "'Zucchero di canna' (azúcar moreno) es la traducción correcta. 'Cane' es perro.",
            successLine: "Perfetto. Sono tre euro in totale.",
            failureLine: "Cosa desidera?"
          },
          {
            prompt: "Sono tre euro in totale.",
            hint: "Indica el total: 3 euros.",
            choices: ["Ecco a Lei. Tenga il resto!", "Ecco a te. Tenga il resto!", "Ecco a Lei. Tenga la mancia!"],
            correct: 0,
            explanation: "'Tenga il resto' es la cortesía para quedarse con el cambio.",
            successLine: "Molto gentile! Buona giornata!",
            failureLine: "Non ho capito."
          }
        ]
      }
    ]
  },
  {
    id: "panetteria", level: "A1", place: "Panetteria", npc: "Fornaio Marco",
    pos: { x: -8.5, z: -11.6 }, color: "#d0a14b",
    cefr: "A1", skill: "interaction", canDo: "Comprar comida en una panaderia",
    grammar: ["plural de sustantivos -i/-e", "articulo indeterminado"],
    vocabTargets: ["cornetti", "farciti", "vuole", "freschi", "quanti"],
    communicativeFunction: "ordering",
    errorTypes: ["plural", "interference"],
    prerequisites: [],
    greeting: {
      it: "Buongiorno! Pane fresco, focaccia calda e dolci appena sfornati. Cosa posso darti?",
      es: "¡Buenos días! Pan fresco, focaccia caliente y dulces recién horneados. ¿Qué puedo darte?"
    },
    vocab: [
      { it: "Cornetti", es: "Croissants" },
      { it: "Quanti", es: "Cuantos" },
      { it: "Grazie", es: "Gracias" },
      { it: "Freschi", es: "Frescos" },
      { it: "Caldo", es: "Caliente" }
    ],
    dialogue: [
      {
        prompt: "Quanti cornetti vuole?",
        hint: "El panadero pregunta cuantos croissants quieres.",
        choices: ["Due cornetti, grazie.", "Due croissant, per favore.", "Due cornetto, per piacere."],
        correct: 0,
        explanation: "'Due cornetti' significa dos croissants italianos. 'Cornetti' es el plural correcto.",
        successLine: "Ecco i suoi cornetti, signore!",
        failureLine: "Prego? Non ho capito la quantità."
      },
      {
        prompt: "Li vuole farciti o vuoti?",
        hint: "Pregunta si los quieres rellenos o vacios.",
        choices: ["Farciti, con crema.", "Relleni, con crema.", "Pieni, per favore."],
        correct: 0,
        explanation: "'Farciti' es el termino correcto para 'rellenos' en italiano.",
        successLine: "Ottima scelta! Sono appena sfornati.",
        failureLine: "Non abbiamo quel ripieno, mi dispiace."
      }
    ],
    success: "Marco ti consegna un sacchetto caldo di cornetti appena sfornati.",
    failure: "Marco mette una cipolla dolce nel sacchetto. Non era la colazione ideale.",
    reward: { name: "Cornetto", points: 10, color: "#d9a03b" },
    failEvent: "badFood",
    progression: [
      {
        // Nivel 2
        greeting: {
          it: "Buongiorno! Di cosa ha bisogno oggi? Abbiamo dell'ottima focaccia.",
          es: "¡Buenos días! ¿Qué necesita hoy? Tenemos una focaccia excelente."
        },
        dialogue: [
          {
            prompt: "Buongiorno! Di cosa ha bisogno oggi?",
            hint: "El panadero te saluda formalmente y pregunta qué necesitas.",
            choices: ["Vorrei due cornetti alla crema, per favore.", "Desidero due cornetti alla crema, per piacere.", "Voglio due cornetti alla crema, per favore."],
            correct: 0,
            explanation: "'Vorrei' es el condicional de cortesía educado.",
            successLine: "Ecco i suoi cornetti! Desidera altro?",
            failureLine: "Prego?"
          },
          {
            prompt: "Li vuole farciti o vuoti?",
            hint: "Pregunta si los quieres rellenos o vacíos.",
            choices: ["Farciti, con crema.", "Relleni, con crema.", "Pieni, per favore."],
            correct: 0,
            explanation: "'Farciti' es el término italiano para rellenos.",
            successLine: "Ottima scelta! Sono appena sfornati.",
            failureLine: "Non ho capito..."
          }
        ]
      },
      {
        // Nivel 3
        greeting: {
          it: "Ciao! Vuoi il solito pane o prendi qualcosa di dolce?",
          es: "¡Hola! ¿Quieres el pan de siempre o te llevas algo dulce?"
        },
        dialogue: [
          {
            prompt: "Ciao! Vuoi il solito pane o prendi something di dolce?",
            hint: "Te saluda amigablemente. Pide un pan tipo ciabatta crujiente.",
            choices: ["Vorrei una ciabatta ben cotta, per favore.", "Voglio una ciabatta ben cucinata, per piacere.", "Desidero una ciabatta ben fatta, per favore."],
            correct: 0,
            explanation: "'Ciabatta' es pan crujiente. 'Ben cotta' (bien hecha/cocida) es lo correcto.",
            successLine: "Certo! Gradisce anche dei grissini?",
            failureLine: "Che tipo di pane?"
          },
          {
            prompt: "Gradisce anche dei grissini?",
            hint: "Te ofrece colines (grissini). Pide un paquete.",
            choices: ["Sì, una confezione di grissini torinesi, grazie.", "Sì, una scatola de grissini torinesi, grazie.", "Sì, un pacchetto de grissini torinesi, per favore."],
            correct: 0,
            explanation: "'Una confezione' (paquete/envase comercial) es el término adecuado.",
            successLine: "Molto bene. Ecco a te!",
            failureLine: "Scusa?"
          }
        ]
      },
      {
        // Nivel 4
        greeting: {
          it: "Salve! Oggi abbiamo una specialità: focaccia di Recco. Ne vuole una porzione?",
          es: "¡Hola! Hoy tenemos una especialidad: focaccia de Recco. ¿Quiere una porción?"
        },
        dialogue: [
          {
            prompt: "Salve! Oggi abbiamo la focaccia di Recco. Ne vuole una porzione?",
            hint: "Ofrece porción de focaccia de Recco. Acepta con gusto.",
            choices: ["Sì, volentieri! Una porzione, grazie.", "Sì, con piacere! Un pezzo, per favore.", "Sì, grazie! La voglio provar."],
            correct: 0,
            explanation: "'Sì, volentieri!' es la frase idiomática ideal para aceptar con gusto.",
            successLine: "Ottimo. La riscaldo un momento?",
            failureLine: "Non ho capito bene se la vuole..."
          },
          {
            prompt: "La riscaldo un momento?",
            hint: "Pregunta si la calienta. Responde que sí.",
            choices: ["Sì, grazie, calda è molto meglio.", "Sì, gracias, caliente è molto meglio.", "Sì, grazie, calorosa è molto meglio."],
            correct: 0,
            explanation: "'Calda' es caliente (femenino). Evita palabras españolas o impropias.",
            successLine: "Ecco a Lei! Calda e filante. Sono cinque euro.",
            failureLine: "Come dice?"
          },
          {
            prompt: "Sono cinque euro.",
            hint: "Indica el total: 5 euros. Paga con billete de 10.",
            choices: ["Pago con una banconota da dieci euro. Ecco a Lei.", "Pago con un biglietto da dieci euro. Ecco a Lei.", "Pago con carta di credito, grazie."],
            correct: 0,
            explanation: "Billete de dinero es 'banconota' (no 'biglietto', que es de transporte/cine).",
            successLine: "Ecco il resto e lo scontrino. Arrivederci!",
            failureLine: "Come paga?"
          }
        ]
      }
    ],
    success: "Marco ti consegna un sacchetto caldo di cornetti appena sfornati.",
    failure: "Marco mette una cipolla dolce nel sacchetto. Non era la colazione ideale.",
    reward: { name: "Cornetto", points: 10, color: "#d9a03b" },
    failEvent: "badFood"
  },
  {
    id: "mercato", level: "A1", place: "Mercato", npc: "Venditrice Livia",
    pos: { x: -15.6, z: 1.4 }, color: "#5b8c61",
    cefr: "A1", skill: "interaction", canDo: "Comprar fruta en un mercado",
    grammar: ["articulo partitivo delle/dei", "quanto/quanti"],
    vocabTargets: ["mele", "arance", "fresche", "chilo", "vorrei"],
    communicativeFunction: "ordering",
    errorTypes: ["article", "interference"],
    prerequisites: [],
    vocab: [
      { it: "Mele", es: "Manzanas" },
      { it: "Arance", es: "Naranjas" },
      { it: "Vorrei", es: "Quisiera" },
      { it: "Quanto costa?", es: "Cuanto cuesta?" },
      { it: "Fresche", es: "Frescas" }
    ],
    dialogue: [
      {
        prompt: "Vuole mele o arance?",
        hint: "La vendedora ofrece manzanas o naranjas.",
        choices: ["Vorrei delle mele, per favore.", "Voglio mele, per favore.", "Voglio mele, per piacere."],
        correct: 0,
        explanation: "'Vorrei delle mele': quisiera unas manzanas. 'Delle' es el articulo partitivo.",
        successLine: "Benissimo! Sono molto fresche oggi.",
        failureLine: "Non ho capito... mele o arance?"
      },
      {
        prompt: "Quanti chili ne vuole?",
        hint: "Pregunta cuantos kilos quieres.",
        choices: ["Un chilo, grazie.", "Uno kilo, per favore.", "Un kilo, per favore."],
        correct: 0,
        explanation: "'Un chilo' (sin 'k') es la forma italiana correcta.",
        successLine: "Ecco qua! Due euro, per favore.",
        failureLine: "Scusi, non ho la bilancia per quella quantità."
      }
    ],
    success: "Livia pesa le mele e te ne regala una extra per la gentilezza.",
    failure: "Esci con un sacchetto pieno di limoni amari.",
    reward: { name: "Panino", points: 15, color: "#b9803a" },
    failEvent: "badFood"
  },
  {
    id: "parrucchiere", level: "A2", place: "Parrucchiere", npc: "Toni il Barbiere",
    pos: { x: 15.7, z: 8.8 }, color: "#5fa6a7",
    cefr: "A2", skill: "interaction", canDo: "Dar instrucciones en la peluqueria",
    grammar: ["imperativo formale Lei", "articulo partitivo un po'"],
    vocabTargets: ["capelli", "tagliare", "un po'", "spuntatina", "barba"],
    communicativeFunction: "giving-instructions",
    errorTypes: ["article", "interference"],
    prerequisites: ["caffe"],
    vocab: [
      { it: "Capelli", es: "Cabello" },
      { it: "Tagliare", es: "Cortar" },
      { it: "Un po'", es: "Un poco" },
      { it: "Accorciare", es: "Acortar" },
      { it: "Pettine", es: "Peine" }
    ],
    dialogue: [
      {
        prompt: "Come vuole tagliare i capelli?",
        hint: "El peluquero pregunta como quieres el corte.",
        choices: ["Solo un po', per favore.", "Solamente un pochino, per favore.", "Solo un poco, per piacere."],
        correct: 0,
        explanation: "'Solo un po'' significa 'solo un poco'. Perfecto para evitar cambios extremos.",
        successLine: "Va bene! Solo una spuntatina allora.",
        failureLine: "Come? Può ripetere?"
      },
      {
        prompt: "Vuole anche la barba?",
        hint: "Pregunta si tambien quieres arreglo de barba.",
        choices: ["No, solo i capelli, grazie.", "No, solo il capello, grazie.", "No, solo la barba no, per favore."],
        correct: 0,
        explanation: "'Solo i capelli' es la respuesta natural: 'solo el cabello'.",
        successLine: "Perfetto! Dieci minuti ed è pronto!",
        failureLine: "Ho capito male... ricominciamo da capo."
      }
    ],
    success: "Toni sistema la tua pettinatura con precisione millimetrica.",
    failure: "Toni capisce qualcosa di strano e ti lascia un taglio blu temporaneo.",
    reward: { name: "Gelato", points: 25, color: "#e7b6c9" },
    failEvent: "badHair"
  },
  {
    id: "stazione", level: "A2", place: "Stazione", npc: "Agente Ricci",
    pos: { x: -19.8, z: 16.2 }, color: "#8c7b68",
    cefr: "A2", skill: "interaction", canDo: "Pedir y entender direcciones de transporte",
    grammar: ["preposiciones articuladas al/alla", "dove + verbo"],
    vocabTargets: ["binario", "treno", "biglietto", "orario", "convalidare"],
    communicativeFunction: "asking-directions",
    errorTypes: ["interference", "preposition"],
    prerequisites: ["panetteria", "caffe"],
    vocab: [
      { it: "Binario", es: "Anden" },
      { it: "Treno", es: "Tren" },
      { it: "Biglietto", es: "Billete" },
      { it: "Orario", es: "Horario" },
      { it: "Partenza", es: "Salida" }
    ],
    dialogue: [
      {
        prompt: "Per il centro, prenda il binario due.",
        hint: "El agente indica que para el centro debes tomar el anden dos.",
        choices: ["Grazie, vado al binario due.", "Grazie, vado alla piattaforma due.", "Grazie, vado a il binario due."],
        correct: 0,
        explanation: "'Binario due' significa anden dos. 'Grazie, vado al...' es 'Gracias, voy al...'",
        successLine: "Esatto! Il treno arriva tra cinque minuti.",
        failureLine: "No, guardi meglio il tabellone degli orari."
      },
      {
        prompt: "Ha già il biglietto?",
        hint: "Pregunta si ya tienes el billete.",
        choices: ["No, dove posso comprarlo?", "No, dove posso a comprarlo?", "Non ancora. Dove si compra?"],
        correct: 0,
        explanation: "'Dove posso comprarlo?' = 'Donde puedo comprarlo?' es la forma mas natural.",
        successLine: "Alla biglietteria automatica, laggiù in fondo.",
        failureLine: "Deve convalidarlo prima di salire sul treno."
      }
    ],
    success: "Arrivi al binario giusto e sblocchi una nuova rotta.",
    failure: "Confondi il binario e finisci dall'altra parte della stazione.",
    reward: { name: "Pizza", points: 20, color: "#e1b041" },
    failEvent: "wrongPlatform"
  },
  {
    id: "farmacia", level: "A2", place: "Farmacia", npc: "Dottoressa Elena",
    pos: { x: 0.6, z: 18.5 }, color: "#78b36c",
    cefr: "A2", skill: "interaction", canDo: "Describir sintomas en una farmacia",
    grammar: ["avere mal di + sustantivo", "articulo indeterminativo un/una/un'"],
    vocabTargets: ["sintomi", "mal di testa", "febbre", "allergia", "farmaco"],
    communicativeFunction: "describing",
    errorTypes: ["conjugation", "interference"],
    prerequisites: ["panetteria"],
    vocab: [
      { it: "Sintomi", es: "Sintomas" },
      { it: "Mal di testa", es: "Dolor de cabeza" },
      { it: "Febbre", es: "Fiebre" },
      { it: "Farmaco", es: "Medicamento" },
      { it: "Ricetta", es: "Receta" }
    ],
    dialogue: [
      {
        prompt: "Che sintomi ha?",
        hint: "La doctora pregunta que sintomas tienes.",
        choices: ["Ho mal di testa e un po' di febbre.", "Ho mal di testa e febbre.", "Ho dolore di testa e febbre."],
        correct: 0,
        explanation: "'Ho mal di testa' es la expresion correcta. 'Un po' di febbre' = un poco de fiebre.",
        successLine: "Da quanto tempo? Da ieri?",
        failureLine: "Mi descriva meglio i sintomi, per favore."
      },
      {
        prompt: "È allergico a qualche farmaco?",
        hint: "Pregunta si eres allergico a algun medicamento.",
        choices: ["No, nessuna allergia.", "No, nessuno allergia.", "Non sono allergico a niente."],
        correct: 0,
        explanation: "'Nessuna allergia' es la respuesta mas directa y correcta.",
        successLine: "Bene. Le prescrivo un analgesico leggero.",
        failureLine: "Devo saperlo per sicurezza. Ci riprovi."
      }
    ],
    success: "Elena ti dà una raccomandazione chiara e recuperi energia.",
    failure: "Ti porti via uno sciroppo sbagliato e tutto gira per qualche secondo.",
    reward: { name: "Malteada", points: 40, color: "#d8c3ff" },
    failEvent: "dizzy"
  },
  {
    id: "negozio", level: "A2", place: "Negozio di vestiti", npc: "Commessa Giulia",
    pos: { x: -20.4, z: -16.4 }, color: "#a66f9f",
    cefr: "A2", skill: "interaction", canDo: "Comprar ropa y expresar preferencias",
    grammar: ["verbo portare per taglie", "preferire + articulo"],
    vocabTargets: ["taglia", "portare", "prova", "colore", "preferisco"],
    communicativeFunction: "shopping",
    errorTypes: ["conjugation", "interference"],
    prerequisites: ["caffe", "mercato"],
    vocab: [
      { it: "Taglia", es: "Talla" },
      { it: "Portare", es: "Usar/Llevar" },
      { it: "Media", es: "Mediana" },
      { it: "Prova", es: "Prueba/Probador" },
      { it: "Colore", es: "Color" }
    ],
    dialogue: [
      {
        prompt: "Che taglia porta?",
        hint: "La dependienta pregunta que talla usas.",
        choices: ["Porto una taglia media.", "Uso una taglia media.", "Porto una taglia mediana."],
        correct: 0,
        explanation: "'Porto una taglia media' es la expresion correcta. 'Portare' se usa para tallas.",
        successLine: "Perfetto! Abbiamo questa giacca nella sua taglia.",
        failureLine: "Mi dispiace, non abbiamo quella taglia in questo modello."
      },
      {
        prompt: "Le piace questo colore o preferisce il blu?",
        hint: "Pregunta si te gusta este color o prefieres el azul.",
        choices: ["Preferisco il blu, grazie.", "Prefero il blu, grazie.", "Meglio il blu, per piacere."],
        correct: 0,
        explanation: "'Preferisco' (con 'sc') es la conjugacion correcta. 'Prefero' no existe en italiano.",
        successLine: "Buona scelta! Il blu le sta molto bene.",
        failureLine: "Non abbiamo questo colore in magazzino."
      }
    ],
    success: "Giulia trova una giacca che si abbina al tuo look.",
    failure: "Esci con colori mescolati che non avevi chiesto.",
    reward: { name: "Hotdog", points: 30, color: "#d8993e" },
    failEvent: "badOutfit"
  },
  {
    id: "ristorante", level: "B1", place: "Ristorante", npc: "Cameriere Paolo",
    pos: { x: 22.5, z: -18.2 }, color: "#b0493b",
    cefr: "B1", skill: "interaction", canDo: "Ordenar comida en un restaurante y manejar reservas",
    grammar: ["preposizione a nome di", "condizionale vorrei/prenderei"],
    vocabTargets: ["prenotato", "ordinato", "conto", "piatto", "volentieri"],
    communicativeFunction: "ordering",
    errorTypes: ["preposition", "register"],
    prerequisites: ["parrucchiere", "negozio"],
    vocab: [
      { it: "Ordinato", es: "Pedido" },
      { it: "Piatto", es: "Plato" },
      { it: "Conto", es: "Cuenta" },
      { it: "Prenotato", es: "Reservado" },
      { it: "Cameriere", es: "Mesero" }
    ],
    dialogue: [
      {
        prompt: "Ha prenotato un tavolo?",
        hint: "El mesero pregunta si reservaste mesa.",
        choices: ["Sì, a nome di {name}.", "Sì, in nome di {name}.", "Sì, nel nome di {name}."],
        correct: 0,
        explanation: "'A nome di' es la preposicion correcta para 'a nombre de'.",
        successLine: "Ah, ecco! Il suo tavolo è vicino alla finestra.",
        failureLine: "Non trovo la sua prenotazione. Ha il numero di conferma?"
      },
      {
        prompt: "Ha già deciso cosa ordinare?",
        hint: "Pregunta si ya decidiste que pedir.",
        choices: ["Prendo gli spaghetti al pomodoro.", "Prendo i spaghetti al pomodoro.", "Voglio spaghetti con pomodoro."],
        correct: 0,
        explanation: "'Prendo gli spaghetti...' = 'Tomare los espaguetis...' usando el articulo correcto 'gli'.",
        successLine: "Ottima scelta! E da bere?",
        failureLine: "Quel piatto non è disponibile oggi, mi dispiace."
      },
      {
        prompt: "Desidera anche il dolce? Abbiamo tiramisù.",
        hint: "Ofrece postre: tiramisù.",
        choices: ["Sì, volentieri! Un tiramisù.", "Sì, certo. Un tiramisù.", "Sì, con piacere. Uno tiramisù."],
        correct: 0,
        explanation: "'Volentieri' expresa aceptacion con entusiasmo. El articulo 'un' es correcto con tiramisù.",
        successLine: "Arriva subito! Buon appetito!",
        failureLine: "Il dolce è finito purtroppo. Vuole un caffè?"
      }
    ],
    success: "Paolo porta il tuo ordine correttamente e la cena è deliziosa.",
    failure: "Paolo lascia una pizza con olive nere e salsa verde brillante.",
    reward: { name: "Hamburguesa", points: 30, color: "#a96c38" },
    failEvent: "badFood"
  },
  {
    id: "parco", level: "B1", place: "Parco", npc: "Studente Nico",
    pos: { x: -3.2, z: -24.5 }, color: "#4f8a76",
    cefr: "B1", skill: "interaction", canDo: "Hacer y aceptar invitaciones sociales informales",
    grammar: ["condizionale mi piacerebbe", "preposizioni di tempo a/alle"],
    vocabTargets: ["volentieri", "più tardi", "a che ora", "impegnato", "d'accordo"],
    communicativeFunction: "inviting",
    errorTypes: ["register", "interference"],
    prerequisites: ["farmacia", "stazione"],
    vocab: [
      { it: "Volentieri", es: "Con gusto" },
      { it: "Più tardi", es: "Mas tarde" },
      { it: "A che ora?", es: "A que hora?" },
      { it: "Impegnato", es: "Ocupado" },
      { it: "D'accordo", es: "De acuerdo" }
    ],
    dialogue: [
      {
        prompt: "Ti va di prendere un caffè più tardi?",
        hint: "Nico pregunta si te apetece tomar un cafe mas tarde.",
        choices: ["Sì, volentieri. A che ora?", "Sì, con gusto. A che ora?", "D'accordo. Che ora?"],
        correct: 0,
        explanation: "'Si, volentieri' expresa aceptacion amable: 'si, con gusto'.",
        successLine: "Alle cinque? Davanti alla fontana in piazza!",
        failureLine: "Forse un'altra volta allora... ciao!"
      },
      {
        prompt: "Sei uno studente anche tu?",
        hint: "Pregunta si eres estudiante tambien.",
        choices: ["Sì, studio italiano.", "Sì, sto studiando la lingua.", "Sì, imparo l'italiano."],
        correct: 0,
        explanation: "Ambas opciones son validas, pero 'studio italiano' es la mas natural.",
        successLine: "Che bello! Parli già molto bene!",
        failureLine: "Ah, pensavo fossi di Milano... che strano!"
      }
    ],
    success: "Nico segna l'ora e guadagni un amico in città.",
    failure: "Nico resta confuso e cambia argomento rapidamente.",
    reward: { name: "Bunuelo", points: 35, color: "#c9964b" },
    failEvent: "awkward"
  },
  {
    id: "festa", level: "B1", place: "Festa in piazza", npc: "Organizzatrice Alba",
    pos: { x: 5.6, z: 24.1 }, color: "#c95e5e",
    cefr: "B1", skill: "interaction", canDo: "Ayudar a organizar un evento social",
    grammar: ["preposizioni articolate accanto al/vicino alla", "imperativo informale"],
    vocabTargets: ["aiutare", "bevande", "fontana", "vicino", "palco"],
    communicativeFunction: "organizing",
    errorTypes: ["preposition", "gender"],
    prerequisites: ["ristorante"],
    vocab: [
      { it: "Aiutare", es: "Ayudar" },
      { it: "Bevande", es: "Bebidas" },
      { it: "Fontana", es: "Fuente" },
      { it: "Vicino", es: "Cerca" },
      { it: "Tavolo", es: "Mesa" }
    ],
    dialogue: [
      {
        prompt: "Puoi aiutarmi a trovare il tavolo delle bevande?",
        hint: "Alba pide ayuda para encontrar la mesa de bebidas.",
        choices: ["Certo! È vicino alla fontana.", "Certo! È vicino al fontana.", "Certo! Sta vicino la fontana."],
        correct: 0,
        explanation: "'Certo' = 'claro'. 'È vicino alla fontana' usa la preposicion articulada 'alla'.",
        successLine: "Ah, non l'avevo visto! Grazie mille!",
        failureLine: "Non è lì... forse hai visto male?"
      },
      {
        prompt: "Hai visto anche il tavolo dei dolci?",
        hint: "Pregunta si viste la mesa de postres.",
        choices: ["Sì, è accanto al palco.", "Sì, è al lato del palco.", "Sì, sta vicino il palco."],
        correct: 0,
        explanation: "'Accanto al palco' = 'junto al escenario'. 'Accanto a' + 'il' se contrae a 'al'.",
        successLine: "Perfetto! Sei un angelo, grazie!",
        failureLine: "Dovrei controllare meglio... ma grazie lo stesso!"
      }
    ],
    success: "Aiuti Alba e tutti festeggiano il tuo italiano.",
    failure: "Il tavolo finisce sul palco e la festa si ferma un momento.",
    reward: { name: "Tronco azul", points: 60, color: "#4d8bd6" },
    failEvent: "awkward"
  },
  {
    id: "hotel", level: "A1", place: "Hotel", npc: "Receptionist Anna",
    pos: { x: 19.5, z: -2.5 }, color: "#5e7fa8",
    cefr: "A1", skill: "interaction", canDo: "Hacer check-in en un hotel",
    grammar: ["avere + sustantivo", "numeri cardinali"],
    vocabTargets: ["prenotazione", "camera", "chiave", "piano", "soggiorno"],
    communicativeFunction: "checking-in",
    errorTypes: ["plural", "interference"],
    prerequisites: [],
    vocab: [
      { it: "Prenotazione", es: "Reserva" },
      { it: "Camera", es: "Habitacion" },
      { it: "Chiave", es: "Llave" },
      { it: "Piano", es: "Piso" },
      { it: "Soggiorno", es: "Estancia" }
    ],
    dialogue: [
      {
        prompt: "Buonasera! Ha una prenotazione?",
        hint: "La recepcionista pregunta si tienes reserva.",
        choices: ["Sì, a nome di {name}.", "Sì, in nome di {name}.", "Sì, nel nome di {name}."],
        correct: 0,
        explanation: "'A nome di' es la preposicion correcta para 'a nombre de'.",
        successLine: "Eccola! Camera singola al terzo piano.",
        failureLine: "Non trovo la sua prenotazione nel sistema."
      },
      {
        prompt: "Quante notti si ferma?",
        hint: "Pregunta cuantas noches te quedas.",
        choices: ["Tre notti, per favore.", "Tre nottes, per favore.", "Tre notte, per favore."],
        correct: 0,
        explanation: "'Tre notti' (plural de 'notte') es correcto. 'Nottes' no existe.",
        successLine: "Ecco la chiave. La colazione è dalle 7 alle 10.",
        failureLine: "Per quel periodo abbiamo solo suite disponibili."
      },
      {
        prompt: "Ha bisogno di aiuto con i bagagli?",
        hint: "Ofrece ayuda con el equipaje.",
        choices: ["No, grazie. Ho solo questa borsa.", "No, grazie. Ho solo questo borsa.", "Grazie, ma faccio da solo."],
        correct: 0,
        explanation: "'Ho solo questa borsa' = 'solo tengo esta bolsa'. Natural y educado.",
        successLine: "Buon soggiorno allora! Se ha bisogno, chiami pure.",
        failureLine: "Il facchino arriva subito... ah, ha cambiato idea?"
      }
    ],
    success: "Anna ti consegna la chiave con un sorriso professionale.",
    failure: "Ti assegnano una stanza in ristrutturazione. C'è polvere dappertutto.",
    reward: { name: "Tiramisu", points: 10, color: "#8B6914" },
    failEvent: "awkward"
  },
  {
    id: "gelateria", level: "A1", place: "Gelateria", npc: "Gelataio Mario",
    pos: { x: -15.0, z: -7.0 }, color: "#ffb6c1",
    cefr: "A1", skill: "interaction", canDo: "Pedir un helado eligiendo sabores",
    grammar: ["articolo indeterminativo un/una", "e (congiunzione)"],
    vocabTargets: ["gusti", "cono", "coppetta", "panna", "cioccolato", "fragola"],
    communicativeFunction: "ordering",
    errorTypes: ["article", "interference"],
    prerequisites: [],
    vocab: [
      { it: "Gusti", es: "Sabores" },
      { it: "Cono", es: "Cono" },
      { it: "Coppetta", es: "Vasito" },
      { it: "Panna", es: "Nata" },
      { it: "Cioccolato", es: "Chocolate" }
    ],
    dialogue: [
      {
        prompt: "Cono o coppetta?",
        hint: "Pregunta si quieres cono o vasito.",
        choices: ["Un cono, per favore.", "Un gelato al cono, per piacere.", "Cono, per piacere."],
        correct: 0,
        explanation: "'Un cono, per favore' es la respuesta mas natural y correcta.",
        successLine: "Quanti gusti desidera?",
        failureLine: "Abbiamo finito i coni. Solo coppetta oggi!"
      },
      {
        prompt: "Quali gusti preferisce?",
        hint: "Pregunta que sabores prefieres.",
        choices: ["Cioccolato e fragola.", "Cioccolata e fragola, per piacere.", "Cioccolato con fragola, per piacere."],
        correct: 0,
        explanation: "'Cioccolato e fragola' es correcto. 'Fragola' no cambia en este contexto.",
        successLine: "Ecco qua! Con panna? Costa solo 50 centesimi in più.",
        failureLine: "La fragola è finita. Provi il pistacchio?"
      },
      {
        prompt: "Sono tre euro.",
        hint: "Te dice el precio: 3 euros.",
        choices: ["Ecco a Lei. Grazie!", "Ecco per Lei. Grazie!", "Ecco. Tenga."],
        correct: 0,
        explanation: "'Ecco a Lei' es la forma formal correcta de 'aqui tiene'.",
        successLine: "Grazie! Buona giornata!",
        failureLine: "Mi dispiace, non ho resto per quella banconota."
      }
    ],
    success: "Mario prepara un gelato doppio perfetto. È delizioso!",
    failure: "Mario confonde i gusti e ti dà qualcosa di immangiabile.",
    reward: { name: "Gelato Doppio", points: 15, color: "#FFB6C1" },
    failEvent: "badFood"
  },
  {
    id: "taxi", level: "A2", place: "Taxi", npc: "Tassista Bruno",
    pos: { x: 26.0, z: -8.0 }, color: "#f5d76e",
    cefr: "A2", skill: "interaction", canDo: "Tomar un taxi y dar direcciones basicas",
    grammar: ["preposizioni di luogo in/a", "imperativo formale vada/giri"],
    vocabTargets: ["indirizzo", "destinazione", "girare", "fermarsi", "resto"],
    communicativeFunction: "asking-directions",
    errorTypes: ["preposition", "register"],
    prerequisites: ["caffe", "hotel"],
    vocab: [
      { it: "Indirizzo", es: "Direccion" },
      { it: "Destinazione", es: "Destino" },
      { it: "Quanto costa?", es: "Cuanto cuesta?" },
      { it: "Girare", es: "Girar" },
      { it: "Fermarsi", es: "Parar" }
    ],
    dialogue: [
      {
        prompt: "Dove la porto?",
        hint: "El taxista pregunta a donde te lleva.",
        choices: ["In centro, per favore.", "Al centro, per favore.", "Nel centro, per piacere."],
        correct: 0,
        explanation: "'In centro' usa la preposicion correcta para destinos de zona generica.",
        successLine: "D'accordo! Per la strada veloce?",
        failureLine: "Non conosco quella via. Ha l'indirizzo esatto?"
      },
      {
        prompt: "Preferisce la strada panoramica? Ci mette più tempo.",
        hint: "Ofrece ruta panoramica pero avisa que tarda mas.",
        choices: ["No, vada diretto, grazie.", "No, va diretto, grazie.", "Meglio la strada veloce."],
        correct: 0,
        explanation: "'Vada diretto' usa el subjuntivo formal (Lei) correctamente.",
        successLine: "Va bene! Arriveremo in dieci minuti.",
        failureLine: "C'è traffico sulla strada veloce oggi."
      },
      {
        prompt: "Ecco, siamo arrivati. Sono quindici euro.",
        hint: "Llegaron. Son 15 euros.",
        choices: ["Ecco venti. Tenga il resto.", "Ecco venti. Tenga il cambio.", "Tenga. Arrivederci."],
        correct: 0,
        explanation: "'Tenga il resto' = 'quedese con el cambio'. Uso correcto del imperativo formal.",
        successLine: "Grazie! Buona permanenza in città!",
        failureLine: "Mi dispiace, il POS non funziona oggi. Solo contanti."
      }
    ],
    success: "Bruno ti porta per una strada bellissima. Arrivi in tempo.",
    failure: "Bruno prende una scorciatoia sbagliata e finite in un vicolo.",
    reward: { name: "Arancino", points: 25, color: "#D4841A" },
    failEvent: "wrongPlatform"
  },
  {
    id: "museo", level: "A2", place: "Museo", npc: "Bigliettaia Carla",
    pos: { x: 22.5, z: 14.0 }, color: "#8d9b6a",
    cefr: "A2", skill: "interaction", canDo: "Comprar entradas y preguntar por descuentos",
    grammar: ["aggettivi dimostrativi questo/quello", "preposizioni di prezzo"],
    vocabTargets: ["biglietto", "sconto", "studente", "mostra", "temporanea"],
    communicativeFunction: "shopping",
    errorTypes: ["gender", "interference"],
    prerequisites: ["panetteria", "gelateria"],
    vocab: [
      { it: "Biglietto", es: "Entrada" },
      { it: "Sconto", es: "Descuento" },
      { it: "Studente", es: "Estudiante" },
      { it: "Mostra", es: "Exposicion" },
      { it: "Orario", es: "Horario" }
    ],
    dialogue: [
      {
        prompt: "Intero o ridotto?",
        hint: "Pregunta si entrada normal o reducida.",
        choices: ["Ridotto, sono studente.", "Ridotta, sono studente.", "Ridotto, perché sono un studente."],
        correct: 0,
        explanation: "'Ridotto' es 'reducido' en italiano. 'Sono studente' = 'soy estudiante'.",
        successLine: "Mi mostri un documento, per favore.",
        failureLine: "Il ridotto è solo per under 26 con tesserino."
      },
      {
        prompt: "Le interessa anche la mostra temporanea?",
        hint: "Ofrece entrada a exposicion temporal.",
        choices: ["Sì, quanto costa in più?", "Sì, quanto costano in più?", "Sì. Qual è il prezzo aggiuntivo?"],
        correct: 0,
        explanation: "'Quanto costa in più?' es la forma mas directa y natural.",
        successLine: "Solo quattro euro. Ne vale la pena!",
        failureLine: "Purtroppo chiude tra mezz'ora. Meglio tornare domani."
      }
    ],
    success: "Carla ti dà una mappa del museo segnando le sale migliori.",
    failure: "Ti danno il biglietto sbagliato e entri a un matrimonio privato.",
    reward: { name: "Cannolo", points: 20, color: "#C9964B" },
    failEvent: "awkward"
  },
  {
    id: "supermercato", level: "A1", place: "Supermercato", npc: "Cassiere Davide",
    pos: { x: -25.0, z: -8.0 }, color: "#c7a55a",
    cefr: "A1", skill: "interaction", canDo: "Pagar en la caja del supermercado",
    grammar: ["ce l'ho (possesso idiomatico)", "negazione non...nessuno"],
    vocabTargets: ["sacchetto", "scontrino", "contanti", "bancomat", "tessera"],
    communicativeFunction: "shopping",
    errorTypes: ["idiom", "interference"],
    prerequisites: [],
    vocab: [
      { it: "Sacchetto", es: "Bolsa" },
      { it: "Scontrino", es: "Ticket" },
      { it: "Contanti", es: "Efectivo" },
      { it: "Bancomat", es: "Tarjeta" },
      { it: "Resto", es: "Cambio" }
    ],
    dialogue: [
      {
        prompt: "Vuole un sacchetto?",
        hint: "Pregunta si quieres una bolsa.",
        choices: ["Sì, grazie.", "Sì, per favore.", "D'accordo."],
        correct: 0,
        explanation: "'Si, grazie' es la respuesta mas simple y correcta.",
        successLine: "Sono dieci centesimi. Paga in contanti o con bancomat?",
        failureLine: "Non ho sacchetti grandi. Le va bene uno piccolo?"
      },
      {
        prompt: "Ha la tessera fedeltà?",
        hint: "Pregunta si tienes tarjeta de fidelidad.",
        choices: ["No, non ce l'ho.", "No, non la tengo.", "No, non ho."],
        correct: 0,
        explanation: "'Non ce l'ho' = 'no la tengo'. 'Ce l'ho' es la forma idiomatica obligatoria.",
        successLine: "Va bene. Sono ventidue euro in totale.",
        failureLine: "Allora non posso applicare lo sconto di oggi."
      }
    ],
    success: "Davide ti dà lo scontrino e un sorriso. Tutto in ordine.",
    failure: "La borsa si rompe e tutto rotola per terra.",
    reward: { name: "Focaccia", points: 10, color: "#C7A55A" },
    failEvent: "badFood"
  },
  {
    id: "banca", level: "B1", place: "Banca", npc: "Impiegato Franco",
    pos: { x: -28.0, z: 18.0 }, color: "#6b7b3a",
    cefr: "B1", skill: "interaction", canDo: "Realizar transacciones bancarias basicas",
    grammar: ["condizionale vorrei per richieste formali", "preposizioni articolate"],
    vocabTargets: ["cambiare", "conto", "sportello", "tasso di cambio", "commissione"],
    communicativeFunction: "negotiating",
    errorTypes: ["register", "conjugation"],
    prerequisites: ["negozio", "farmacia"],
    vocab: [
      { it: "Cambiare", es: "Cambiar" },
      { it: "Conto", es: "Cuenta" },
      { it: "Sportello", es: "Ventanilla" },
      { it: "Tasso di cambio", es: "Tipo de cambio" },
      { it: "Commissione", es: "Comision" }
    ],
    dialogue: [
      {
        prompt: "Cosa posso fare per Lei?",
        hint: "El empleado pregunta en que puede ayudarte.",
        choices: ["Vorrei cambiare dei soldi.", "Voglio cambiare soldi.", "Devo cambiare i miei soldi."],
        correct: 0,
        explanation: "'Cambiare dei soldi' es la expresion correcta: 'cambiar algo de dinero'.",
        successLine: "Certo! Che valuta ha?",
        failureLine: "Oggi lo sportello cambio è chiuso. Ripassi domani."
      },
      {
        prompt: "Vuole il contante o un accredito sul conto?",
        hint: "Pregunta si quieres efectivo o deposito en cuenta.",
        choices: ["Contante, per favore.", "Soldi contanti, per piacere.", "In contanti, grazie."],
        correct: 0,
        explanation: "'Contante' es la forma abreviada comun de 'denaro contante'.",
        successLine: "Ecco. Il tasso oggi è favorevole.",
        failureLine: "C'è una commissione di cinque euro. Procedo lo stesso?"
      }
    ],
    success: "Franco elabora il cambio rapidamente con un buon tasso.",
    failure: "Ti applicano una commissione a sorpresa del 20%.",
    reward: { name: "Panna Cotta", points: 35, color: "#F0E6D0" },
    failEvent: "dizzy"
  },
  {
    id: "spiaggia", level: "A2", place: "Spiaggia", npc: "Bagnino Gianni",
    pos: { x: 30.0, z: 24.0 }, color: "#e8464b",
    cefr: "A2", skill: "interaction", canDo: "Alquilar servicios en la playa",
    grammar: ["ce l'ho idiomatico", "preposizioni di tempo per tutto/a"],
    vocabTargets: ["ombrellone", "lettino", "crema solare", "onde", "chiosco"],
    communicativeFunction: "renting",
    errorTypes: ["idiom", "interference"],
    prerequisites: ["stazione"],
    vocab: [
      { it: "Ombrellone", es: "Sombrilla" },
      { it: "Lettino", es: "Tumbona" },
      { it: "Crema solare", es: "Protector solar" },
      { it: "Onde", es: "Olas" },
      { it: "Spiaggia", es: "Playa" }
    ],
    dialogue: [
      {
        prompt: "Vuole affittare un ombrellone?",
        hint: "Pregunta si quieres alquilar una sombrilla.",
        choices: ["Sì, quanto costa?", "Sì, quante costa?", "Quanto per un ombrellone?"],
        correct: 0,
        explanation: "'Si, quanto costa?' es la respuesta mas natural.",
        successLine: "Quindici euro per tutto il giorno. Anche due lettini?",
        failureLine: "Spiacente, tutti gli ombrelloni sono prenotati oggi."
      },
      {
        prompt: "Ha la crema solare? Il sole è forte oggi.",
        hint: "Recomienda usar protector solar.",
        choices: ["Sì, ce l'ho. Grazie.", "Sì, la tengo. Grazie.", "Sì, ho la crema. Grazie."],
        correct: 0,
        explanation: "'Ce l'ho' es la forma idiomatica obligatoria para 'la tengo' con objetos.",
        successLine: "Bene. Se ha bisogno, sono al chiosco blu.",
        failureLine: "Attento alle meduse oggi, ce ne sono tante."
      }
    ],
    success: "Gianni ti dà il posto migliore, proprio davanti al mare.",
    failure: "Il vento porta via il tuo ombrellone. Finisci scottato.",
    reward: { name: "Granita", points: 20, color: "#E8464B" },
    failEvent: "badOutfit"
  },
  {
    id: "cinema", level: "A2", place: "Cinema", npc: "Cassiera Helena",
    pos: { x: -10.0, z: 28.0 }, color: "#f5d76e",
    cefr: "A2", skill: "interaction", canDo: "Comprar entradas de cine y elegir asiento",
    grammar: ["pronomi interrogativi quale/quali", "preposizioni di luogo in fondo/vicino a"],
    vocabTargets: ["film", "orario", "posto", "fila", "spettacolo"],
    communicativeFunction: "shopping",
    errorTypes: ["interference", "preposition"],
    prerequisites: ["farmacia", "spiaggia"],
    vocab: [
      { it: "Film", es: "Pelicula" },
      { it: "Orario", es: "Horario" },
      { it: "Posto", es: "Asiento" },
      { it: "Fila", es: "Fila" },
      { it: "Spettacolo", es: "Funcion" }
    ],
    dialogue: [
      {
        prompt: "Quale film vuole vedere?",
        hint: "Pregunta que pelicula quieres ver.",
        choices: ["Quale mi consiglia?", "Quale mi raccomanda?", "Cosa c'è di bello?"],
        correct: 0,
        explanation: "'Quale mi consiglia?' = 'Cual me recomienda?' usando el verbo 'consigliare'.",
        successLine: "C'è un bellissimo film italiano! Inizia alle 21.",
        failureLine: "Quel film è tutto esaurito. Ne scelga un altro."
      },
      {
        prompt: "Dove preferisce sedersi?",
        hint: "Pregunta donde prefieres sentarte.",
        choices: ["In fondo, vicino al centro.", "In dietro, vicino il centro.", "In ultima fila, al centro."],
        correct: 0,
        explanation: "'In fondo, vicino al centro' describe bien la posicion deseada.",
        successLine: "Ecco i biglietti! Buona visione!",
        failureLine: "Quei posti sono già occupati. Scelga un'altra fila."
      }
    ],
    success: "Helena ti dà i posti migliori della sala.",
    failure: "Entri nella sala sbagliata. Il film è già iniziato.",
    reward: { name: "Popcorn", points: 15, color: "#F5D76E" },
    failEvent: "awkward"
  },
  {
    id: "ospedale", level: "B1", place: "Pronto Soccorso", npc: "Infermiere Igor",
    pos: { x: -8.0, z: 30.0 }, color: "#6b8e23",
    cefr: "B1", skill: "interaction", canDo: "Describir sintomas medicos con precision",
    grammar: ["aggettivi qualificativi acuto/cronico", "preposizioni articolate allo/nello"],
    vocabTargets: ["dolore", "sintomo", "allergia", "farmaco", "gravita"],
    communicativeFunction: "describing",
    errorTypes: ["gender", "conjugation"],
    prerequisites: ["parco", "banca"],
    vocab: [
      { it: "Dolore", es: "Dolor" },
      { it: "Sintomo", es: "Sintoma" },
      { it: "Allergia", es: "Alergia" },
      { it: "Farmaco", es: "Medicamento" },
      { it: "Gravita", es: "Gravedad" }
    ],
    dialogue: [
      {
        prompt: "Che tipo di dolore sente?",
        hint: "Pregunta que tipo de dolor sientes.",
        choices: ["È un dolore acuto allo stomaco.", "È un dolore aguto allo stomaco.", "È acuto. Nello stomaco."],
        correct: 0,
        explanation: "'Dolore acuto allo stomaco' = 'dolor agudo en el estomago'. Usa la preposicion articulada 'allo'.",
        successLine: "Da quanto tempo? Ha mangiato qualcosa di strano?",
        failureLine: "Deve descrivere meglio il dolore. Scala da uno a dieci?"
      },
      {
        prompt: "Ha qualche allergia ai farmaci?",
        hint: "Pregunta por allergias a medicamentos.",
        choices: ["No, nessuna allergia nota.", "No, nessuna di allergie.", "Non che io ricordi."],
        correct: 0,
        explanation: "'Nessuna allergia nota' = 'ninguna allergia conocida'. Correcto y formal.",
        successLine: "Bene. Le farò una visita veloce.",
        failureLine: "Devo fare attenzione allora. Quali farmaci le danno reazione?"
      }
    ],
    success: "Igor ti visita subito e ti prescrive qualcosa di efficace.",
    failure: "Ti mettono nella sala d'attesa per ore.",
    reward: { name: "Minestrone", points: 40, color: "#6B8E23" },
    failEvent: "dizzy"
  },
  {
    id: "libreria", level: "B1", place: "Libreria", npc: "Libraia Laura",
    pos: { x: 8.0, z: 28.0 }, color: "#c4956a",
    cefr: "B1", skill: "interaction", canDo: "Hablar sobre gustos literarios y recibir recomendaciones",
    grammar: ["condizionale mi piacerebbe", "pronomi diretti lo/la"],
    vocabTargets: ["genere", "autore", "consiglio", "romanzo", "scaffale"],
    communicativeFunction: "discussing",
    errorTypes: ["conjugation", "interference"],
    prerequisites: ["ristorante", "festa"],
    vocab: [
      { it: "Genere", es: "Genero" },
      { it: "Autore", es: "Autor" },
      { it: "Consiglio", es: "Consejo" },
      { it: "Romanzo", es: "Novela" },
      { it: "Scaffale", es: "Estante" }
    ],
    dialogue: [
      {
        prompt: "Che genere di libri le piace?",
        hint: "Pregunta que genero de libros te gusta.",
        choices: ["Mi piacciono i romanzi storici.", "Mi piacciono i romanze storici.", "Preferisco romanzi storici, per piacere."],
        correct: 0,
        explanation: "'Mi piacciono i romanzi' = 'me gustan las novelas'. 'Romanzi' no 'romances' en italiano.",
        successLine: "Allora ho il libro perfetto per Lei!",
        failureLine: "Quel genere è in un altro scaffale. La accompagno."
      },
      {
        prompt: "Conosce questo autore italiano?",
        hint: "Pregunta si conoces a este autor italiano.",
        choices: ["No, ma mi piacerebbe scoprirlo.", "No, ma mi piacerebbe conoscerlo.", "Non lo conosco, ma sembra interessante."],
        correct: 0,
        explanation: "'Mi piacerebbe scoprirlo' = 'me gustaria descubrirlo'. Uso correcto del condicional.",
        successLine: "Provi questo allora. È il suo capolavoro.",
        failureLine: "È un po' difficile per chi studia italiano. Vuole qualcosa di più semplice?"
      }
    ],
    success: "Laura ti consiglia un libro perfetto per il tuo livello.",
    failure: "Compri un libro in dialetto siciliano. Non capisci niente.",
    reward: { name: "Biscotti", points: 30, color: "#C4956A" },
    failEvent: "awkward"
  }
];

window.missions = missions;

// narrativeRoute está en game/narrative.js

