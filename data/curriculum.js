"use strict";

const curriculum = {
  missions: [
    {
      id: "caffe", cefr: "A1", skill: "interaction",
      canDo: "Pedir una bebida en un cafe",
      grammar: ["vorrei + sustantivo", "articulo indeterminativo un/una"],
      vocabTargets: ["caffe", "ristretto", "cornetto", "Buongiorno", "Grazie"],
      communicativeFunction: "ordering",
      errorTypes: ["formality", "interference"],
      prerequisites: []
    },
    {
      id: "panetteria", cefr: "A1", skill: "interaction",
      canDo: "Comprar comida en una panaderia",
      grammar: ["plural de sustantivos -i/-e", "articulo indeterminativo"],
      vocabTargets: ["cornetti", "farciti", "vuole", "freschi", "quanti"],
      communicativeFunction: "ordering",
      errorTypes: ["plural", "interference"],
      prerequisites: []
    },
    {
      id: "mercato", cefr: "A1", skill: "interaction",
      canDo: "Comprar fruta en un mercado",
      grammar: ["articulo partitivo delle/dei", "quanto/quanti"],
      vocabTargets: ["mele", "arance", "fresche", "chilo", "vorrei"],
      communicativeFunction: "ordering",
      errorTypes: ["article", "interference"],
      prerequisites: []
    },
    {
      id: "hotel", cefr: "A1", skill: "interaction",
      canDo: "Hacer check-in en un hotel",
      grammar: ["avere + sustantivo", "numeri cardinali"],
      vocabTargets: ["prenotazione", "camera", "chiave", "piano", "soggiorno"],
      communicativeFunction: "checking-in",
      errorTypes: ["plural", "interference"],
      prerequisites: []
    },
    {
      id: "gelateria", cefr: "A1", skill: "interaction",
      canDo: "Pedir un helado eligiendo sabores",
      grammar: ["articolo indeterminativo un/una", "e (congiunzione)"],
      vocabTargets: ["gusti", "cono", "coppetta", "panna", "cioccolato", "fragola"],
      communicativeFunction: "ordering",
      errorTypes: ["article", "interference"],
      prerequisites: []
    },
    {
      id: "supermercato", cefr: "A1", skill: "interaction",
      canDo: "Pagar en la caja del supermercado",
      grammar: ["ce l'ho (possesso idiomatico)", "negazione non...nessuno"],
      vocabTargets: ["sacchetto", "scontrino", "contanti", "bancomat", "tessera"],
      communicativeFunction: "shopping",
      errorTypes: ["idiom", "interference"],
      prerequisites: []
    },
    {
      id: "parrucchiere", cefr: "A2", skill: "interaction",
      canDo: "Dar instrucciones en la peluqueria",
      grammar: ["imperativo formale Lei", "articolo partitivo un po'"],
      vocabTargets: ["capelli", "tagliare", "un po'", "spuntatina", "barba"],
      communicativeFunction: "giving-instructions",
      errorTypes: ["article", "interference"],
      prerequisites: ["caffe"]
    },
    {
      id: "stazione", cefr: "A2", skill: "interaction",
      canDo: "Pedir y entender direcciones de transporte",
      grammar: ["preposizioni articolate al/alla", "dove + verbo"],
      vocabTargets: ["binario", "treno", "biglietto", "orario", "convalidare"],
      communicativeFunction: "asking-directions",
      errorTypes: ["interference", "preposition"],
      prerequisites: ["panetteria", "caffe"]
    },
    {
      id: "farmacia", cefr: "A2", skill: "interaction",
      canDo: "Describir sintomas en una farmacia",
      grammar: ["avere mal di + sustantivo", "articolo indeterminativo un/una/un'"],
      vocabTargets: ["sintomi", "mal di testa", "febbre", "allergia", "farmaco"],
      communicativeFunction: "describing",
      errorTypes: ["conjugation", "interference"],
      prerequisites: ["panetteria"]
    },
    {
      id: "negozio", cefr: "A2", skill: "interaction",
      canDo: "Comprar ropa y expresar preferencias",
      grammar: ["verbo portare per taglie", "preferire + articolo"],
      vocabTargets: ["taglia", "portare", "prova", "colore", "preferisco"],
      communicativeFunction: "shopping",
      errorTypes: ["conjugation", "interference"],
      prerequisites: ["caffe", "mercato"]
    },
    {
      id: "taxi", cefr: "A2", skill: "interaction",
      canDo: "Tomar un taxi y dar direcciones basicas",
      grammar: ["preposizioni di luogo in/a", "imperativo formale vada/giri"],
      vocabTargets: ["indirizzo", "destinazione", "girare", "fermarsi", "resto"],
      communicativeFunction: "asking-directions",
      errorTypes: ["preposition", "register"],
      prerequisites: ["caffe", "hotel"]
    },
    {
      id: "museo", cefr: "A2", skill: "interaction",
      canDo: "Comprar entradas y preguntar por descuentos",
      grammar: ["aggettivi dimostrativi questo/quello", "preposizioni di prezzo"],
      vocabTargets: ["biglietto", "sconto", "studente", "mostra", "temporanea"],
      communicativeFunction: "shopping",
      errorTypes: ["gender", "interference"],
      prerequisites: ["panetteria", "gelateria"]
    },
    {
      id: "spiaggia", cefr: "A2", skill: "interaction",
      canDo: "Alquilar servicios en la playa",
      grammar: ["ce l'ho idiomatico", "preposizioni di tempo per tutto/a"],
      vocabTargets: ["ombrellone", "lettino", "crema solare", "onde", "chiosco"],
      communicativeFunction: "renting",
      errorTypes: ["idiom", "interference"],
      prerequisites: ["stazione"]
    },
    {
      id: "cinema", cefr: "A2", skill: "interaction",
      canDo: "Comprar entradas de cine y elegir asiento",
      grammar: ["pronomi interrogativi quale/quali", "preposizioni di luogo in fondo/vicino a"],
      vocabTargets: ["film", "orario", "posto", "fila", "spettacolo"],
      communicativeFunction: "shopping",
      errorTypes: ["interference", "preposition"],
      prerequisites: ["farmacia", "spiaggia"]
    },
    {
      id: "ristorante", cefr: "B1", skill: "interaction",
      canDo: "Ordenar comida en un restaurante y manejar reservas",
      grammar: ["preposizione a nome di", "condizionale vorrei/prenderei"],
      vocabTargets: ["prenotato", "ordinato", "conto", "piatto", "volentieri"],
      communicativeFunction: "ordering",
      errorTypes: ["preposition", "register"],
      prerequisites: ["parrucchiere", "negozio"]
    },
    {
      id: "parco", cefr: "B1", skill: "interaction",
      canDo: "Hacer y aceptar invitaciones sociales informales",
      grammar: ["condizionale mi piacerebbe", "preposizioni di tempo a/alle"],
      vocabTargets: ["volentieri", "piu tardi", "a che ora", "impegnato", "d'accordo"],
      communicativeFunction: "inviting",
      errorTypes: ["register", "interference"],
      prerequisites: ["farmacia", "stazione"]
    },
    {
      id: "festa", cefr: "B1", skill: "interaction",
      canDo: "Ayudar a organizar un evento social",
      grammar: ["preposizioni articolate accanto al/vicino alla", "imperativo informale"],
      vocabTargets: ["aiutare", "bevande", "fontana", "vicino", "palco"],
      communicativeFunction: "organizing",
      errorTypes: ["preposition", "gender"],
      prerequisites: ["ristorante"]
    },
    {
      id: "banca", cefr: "B1", skill: "interaction",
      canDo: "Realizar transacciones bancarias basicas",
      grammar: ["condizionale vorrei", "preposizioni articolate"],
      vocabTargets: ["cambiare", "conto", "sportello", "tasso di cambio", "commissione"],
      communicativeFunction: "negotiating",
      errorTypes: ["register", "conjugation"],
      prerequisites: ["negozio", "farmacia"]
    },
    {
      id: "ospedale", cefr: "B1", skill: "interaction",
      canDo: "Describir sintomas medicos con precision",
      grammar: ["aggettivi qualificativi acuto/cronico", "preposizioni articolate allo/nello"],
      vocabTargets: ["dolore", "sintomo", "allergia", "farmaco", "gravita"],
      communicativeFunction: "describing",
      errorTypes: ["gender", "conjugation"],
      prerequisites: ["parco", "banca"]
    },
    {
      id: "libreria", cefr: "B1", skill: "interaction",
      canDo: "Hablar sobre gustos literarios y recibir recomendaciones",
      grammar: ["condizionale mi piacerebbe", "pronomi diretti lo/la"],
      vocabTargets: ["genere", "autore", "consiglio", "romanzo", "scaffale"],
      communicativeFunction: "discussing",
      errorTypes: ["conjugation", "interference"],
      prerequisites: ["ristorante", "festa"]
    }
  ],
  errorTypes: {
    gender: { label: "Genere grammaticale", tip: "En italiano, los sustantivos tienen genero: il (masculino) o la (femenino)." },
    conjugation: { label: "Coniugazione", tip: "Los verbos italianos cambian con cada persona (io, tu, lui/lei, noi, voi, loro)." },
    preposition: { label: "Preposizione", tip: "Las preposiciones italianas (a, di, da, in, con, su, per, tra/fra) se articulan con los articulos." },
    interference: { label: "Interferenza dallo spagnolo", tip: "No traduzcas literalmente del espanol. Aunque son similares, hay diferencias clave." },
    plural: { label: "Plurale", tip: "El plural italiano cambia la vocal final: -o -> -i, -a -> -e, -e -> -i." },
    article: { label: "Articolo", tip: "Los articulos italianos son mas complejos que en espanol: il/lo/la/i/gli/le (determinativos), un/uno/una/un' (indeterminativos)." },
    formality: { label: "Registro formale/informale", tip: "Con desconocidos usa Lei (formal, 3a persona), no tu (informal, 2a persona)." },
    register: { label: "Registro", tip: "Adapta tu registro al contexto: formal para negocios/servicios, informal para amigos/parque." },
    idiom: { label: "Espressioni idiomatiche", tip: "El italiano tiene expresiones fijas distintas al espanol. Aprendelas como frases completas." }
  },
  functions: {
    ordering: "Pedir productos o servicios en comercios",
    "asking-directions": "Preguntar y entender direcciones",
    shopping: "Realizar compras y transacciones",
    describing: "Describir personas, lugares o sintomas",
    "giving-instructions": "Dar instrucciones o indicaciones",
    "checking-in": "Registrarse en alojamientos",
    renting: "Alquilar servicios o equipamiento",
    inviting: "Hacer y aceptar invitaciones sociales",
    organizing: "Ayudar a organizar eventos",
    negotiating: "Negociar precios o condiciones",
    discussing: "Hablar sobre preferencias y opiniones"
  },
  skills: {
    interaction: "Interaccion oral (dialogo, conversacion, transaccion)",
    speaking: "Produccion oral (monologo, descripcion, narracion)",
    listening: "Comprension auditiva (entender al interlocutor)",
    reading: "Comprension lectora (carteles, menus, senales)"
  }
};

window.curriculum = curriculum;
