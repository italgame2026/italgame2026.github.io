"use strict";

// ── Misiones (game.js líneas 87–953) ──
const missions = [
  {
    "id": "caffe",
    "level": "A1",
    "place": "Caffetteria",
    "npc": "Barista Sofia",
    "pos": {
      "x": 8.2,
      "z": -9.4
    },
    "color": "#c76f45",
    "cefr": "A1",
    "skill": "interaction",
    "canDo": "Pedir una bebida en un cafe",
    "grammar": [
      "vorrei + sustantivo",
      "articulo indeterminado un/una"
    ],
    "vocabTargets": [
      "caffè",
      "ristretto",
      "cornetto",
      "Buongiorno",
      "Grazie"
    ],
    "communicativeFunction": "ordering",
    "errorTypes": [
      "formality",
      "interference"
    ],
    "prerequisites": [],
    "greeting": {
      "it": "Buongiorno! Benvenuto al Caffè della Piazza. Cosa posso portarti oggi?",
      "es": "¡Buenos días! Bienvenido al Café de la Plaza. ¿Qué puedo traerte hoy?"
    },
    "vocab": [
      {
        "it": "Buongiorno",
        "es": "Buenos dias"
      },
      {
        "it": "Vorrei",
        "es": "Quisiera"
      },
      {
        "it": "Per favore",
        "es": "Por favor"
      },
      {
        "it": "Grazie",
        "es": "Gracias"
      },
      {
        "it": "Quanto costa?",
        "es": "Cuanto cuesta?"
      }
    ],
    "dialogue": [
      {
        "prompt": "Buongiorno! Cosa desidera?",
        "hint": "La barista te saluda y pregunta que deseas.",
        "choices": [
          "Vorrei un caffè, per favore.",
          "Voglio un caffè, per piacere.",
          "Desidero un caffè, per favore."
        ],
        "correct": 0,
        "explanation": "'Vorrei' (quisiera) + 'per favore' (por favor) es la forma educada estandar.",
        "successLine": "Benissimo! Lungo o ristretto?",
        "failureLine": "Scusi... non ho capito bene."
      },
      {
        "prompt": "Lungo o ristretto?",
        "hint": "Pregunta si lo quieres largo o corto.",
        "choices": [
          "Ristretto, grazie.",
          "Corto, grazie.",
          "Piccolo, per favore."
        ],
        "correct": 0,
        "explanation": "'Ristretto' es el termino correcto para cafe corto/concentrado en Italia.",
        "successLine": "Perfetto! Vuole anche un cornetto?",
        "failureLine": "Mmm... non è proprio così."
      },
      {
        "prompt": "Sono due euro e cinquanta.",
        "hint": "Te dice el precio: 2.50 euros.",
        "choices": [
          "Ecco a Lei. Grazie!",
          "Ecco a te. Grazie!",
          "Ecco a Lei. Grazia!"
        ],
        "correct": 0,
        "explanation": "'Ecco a Lei' es la forma formal de 'aqui tiene'. 'Grazie' (no 'Grazia') es gracias.",
        "successLine": "Grazie a Lei! Buona giornata!",
        "failureLine": "Come dice?"
      }
    ],
    "success": "Sofia prepara un caffè perfetto. Ti senti el benvenuto in Italia.",
    "failure": "Sofia cerca di capirti ma l'ordine esce confuso.",
    "reward": {
      "name": "Caffe",
      "points": 15,
      "color": "#6b3e1e"
    },
    "failEvent": "badFood",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Di nuovo qui? Cosa desidera oggi?",
          "es": "¡Buenos días! ¿De nuevo por aquí? ¿Qué desea hoy?"
        },
        "dialogue": [
          {
            "prompt": "Buongiorno! Di nuevo qui? Cosa desidera oggi?",
            "hint": "La barista te saluda formalmente y pregunta qué deseas hoy.",
            "choices": [
              "Vorrei un caffè, per favore.",
              "Voglio un caffè, per piacere.",
              "Dammi un caffè, per favore."
            ],
            "correct": 0,
            "explanation": "'Vorrei' es el condicional de cortesía adecuado. 'Dammi' (dame) es demasiado informal.",
            "successLine": "Benissimo! Lungo o ristretto?",
            "failureLine": "Scusi... non ho capito bene."
          },
          {
            "prompt": "Lungo o ristretto?",
            "hint": "Pregunta si lo quieres largo o corto.",
            "choices": [
              "Ristretto, grazie.",
              "Corto, grazie.",
              "Piccolo, per favore."
            ],
            "correct": 0,
            "explanation": "'Ristretto' es el término italiano para café concentrado.",
            "successLine": "Perfetto! Vuole anche un cornetto?",
            "failureLine": "Mmm... non è proprio così."
          },
          {
            "prompt": "Sono due euro e cinquanta.",
            "hint": "Te dice el precio: 2.50 euros.",
            "choices": [
              "Ecco a Lei. Grazie!",
              "Ecco a te. Grazie!",
              "Ecco a Lei. Grazia!"
            ],
            "correct": 0,
            "explanation": "'Ecco a Lei' es la cortesía formal para 'aquí tiene'.",
            "successLine": "Grazie a Lei! Buona giornata!",
            "failureLine": "Come dice?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Ormai sei un cliente fisso! Cosa ti preparo?",
          "es": "¡Buenos días! ¡Ya eres un cliente habitual! ¿Qué te preparo?"
        },
        "dialogue": [
          {
            "prompt": "Buongiorno! Ormai sei un cliente fisso! Cosa ti preparo?",
            "hint": "Usa registro informal porque ya te conoce. Responde con cortesía.",
            "choices": [
              "Vorrei un espresso, per favore.",
              "Desidero un espresso, per piacere.",
              "Voglio un espresso, per favore."
            ],
            "correct": 0,
            "explanation": "'Vorrei' sigue siendo la opción más educada.",
            "successLine": "Ottimo! Al tavolo o al banco?",
            "failureLine": "Prego?"
          },
          {
            "prompt": "Al tavolo o al banco?",
            "hint": "Pregunta si lo tomas en mesa o en barra.",
            "choices": [
              "Al banco, grazie.",
              "In barra, grazie.",
              "Al tavolo, per favore."
            ],
            "correct": 0,
            "explanation": "En barra es 'al banco' en italiano.",
            "successLine": "Perfetto, ecco il caffè. Vuole lo scontrino?",
            "failureLine": "Non capisco..."
          },
          {
            "prompt": "Ecco il caffè. Vuole lo scontrino?",
            "hint": "Te ofrece el recibo fiscal (scontrino).",
            "choices": [
              "Sì, grazie. Lo scontrino, per favore.",
              "Sì, grazie. La ricevuta, per favore.",
              "No, grazie. Va bene così."
            ],
            "correct": 0,
            "explanation": "'Lo scontrino' es el recibo fiscal impreso comercial en cafeterías.",
            "successLine": "Ecco a Lei! Buona giornata!",
            "failureLine": "Scusi?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Il solito caffè o vuoi provare qualcosa di nuovo?",
          "es": "¡Hola! ¿El café de siempre o quieres probar algo nuevo?"
        },
        "dialogue": [
          {
            "prompt": "Ciao! Il solito caffè o vuoi provare qualcosa di nuovo?",
            "hint": "Te saluda de forma amigable y ofrece probar algo nuevo.",
            "choices": [
              "Vorrei provare il ginseng, se possibile.",
              "Voglio provare il ginseng, per piacere.",
              "Desidero provare il ginseng, per favore."
            ],
            "correct": 0,
            "explanation": "El café al ginseng es una alternativa popular en Italia.",
            "successLine": "Ottima scelta! In tazza grande o piccola?",
            "failureLine": "Come?"
          },
          {
            "prompt": "In tazza grande o piccola?",
            "hint": "Pregunta si lo quieres en taza grande o pequeña.",
            "choices": [
              "In tazza piccola, grazie.",
              "En taza chica, per favore.",
              "Tazza grande, grazie."
            ],
            "correct": 0,
            "explanation": "'In tazza piccola' es correcto para tamaño espresso.",
            "successLine": "D'accordo! Gradisce dello zucchero o del miele?",
            "failureLine": "Non capisco la dimensión..."
          },
          {
            "prompt": "Gradisce dello zucchero o del miele?",
            "hint": "Te ofrece endulzarlo con azúcar o miel.",
            "choices": [
              "Zucchero di canna, per favore.",
              "Zucchero del cane, per favore.",
              "Miele del cane, per piacere."
            ],
            "correct": 0,
            "explanation": "'Zucchero di canna' (azúcar moreno) es la traducción correcta. 'Cane' es perro.",
            "successLine": "Perfetto. Sono tre euro in totale.",
            "failureLine": "Cosa desidera?"
          },
          {
            "prompt": "Sono tre euro in totale.",
            "hint": "Indica el total: 3 euros.",
            "choices": [
              "Ecco a Lei. Tenga il resto!",
              "Ecco a te. Tenga il resto!",
              "Ecco a Lei. Tenga la mancia!"
            ],
            "correct": 0,
            "explanation": "'Tenga il resto' es la cortesía para quedarse con el cambio.",
            "successLine": "Molto gentile! Buona giornata!",
            "failureLine": "Non ho capito."
          }
        ]
      }
    ]
  },
  {
    "id": "panetteria",
    "level": "A1",
    "place": "Panetteria",
    "npc": "Fornaio Marco",
    "pos": {
      "x": -8.5,
      "z": -11.6
    },
    "color": "#d0a14b",
    "cefr": "A1",
    "skill": "interaction",
    "canDo": "Comprar comida en una panaderia",
    "grammar": [
      "plural de sustantivos -i/-e",
      "articulo indeterminado"
    ],
    "vocabTargets": [
      "cornetti",
      "farciti",
      "vuole",
      "freschi",
      "quanti"
    ],
    "communicativeFunction": "ordering",
    "errorTypes": [
      "plural",
      "interference"
    ],
    "prerequisites": [],
    "greeting": {
      "it": "Buongiorno! Pane fresco, focaccia calda e dolci appena sfornati. Cosa posso darti?",
      "es": "¡Buenos días! Pan fresco, focaccia caliente y dulces recién horneados. ¿Qué puedo darte?"
    },
    "vocab": [
      {
        "it": "Cornetti",
        "es": "Croissants"
      },
      {
        "it": "Quanti",
        "es": "Cuantos"
      },
      {
        "it": "Grazie",
        "es": "Gracias"
      },
      {
        "it": "Freschi",
        "es": "Frescos"
      },
      {
        "it": "Caldo",
        "es": "Caliente"
      }
    ],
    "dialogue": [
      {
        "prompt": "Quanti cornetti vuole?",
        "hint": "El panadero pregunta cuantos croissants quieres.",
        "choices": [
          "Due cornetti, grazie.",
          "Due croissant, per favore.",
          "Due cornetto, per piacere."
        ],
        "correct": 0,
        "explanation": "'Due cornetti' significa dos croissants italianos. 'Cornetti' es el plural correcto.",
        "successLine": "Ecco i suoi cornetti, signore!",
        "failureLine": "Prego? Non ho capito la quantità."
      },
      {
        "prompt": "Li vuole farciti o vuoti?",
        "hint": "Pregunta si los quieres rellenos o vacios.",
        "choices": [
          "Farciti, con crema.",
          "Relleni, con crema.",
          "Pieni, per favore."
        ],
        "correct": 0,
        "explanation": "'Farciti' es el termino correcto para 'rellenos' en italiano.",
        "successLine": "Ottima scelta! Sono appena sfornati.",
        "failureLine": "Non abbiamo quel ripieno, mi dispiace."
      }
    ],
    "success": "Marco ti consegna un sacchetto caldo di cornetti appena sfornati.",
    "failure": "Marco mette una cipolla dolce nel sacchetto. Non era la colazione ideale.",
    "reward": {
      "name": "Cornetto",
      "points": 10,
      "color": "#d9a03b"
    },
    "failEvent": "badFood",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Di cosa ha bisogno oggi? Abbiamo dell'ottima focaccia.",
          "es": "¡Buenos días! ¿Qué necesita hoy? Tenemos una focaccia excelente."
        },
        "dialogue": [
          {
            "prompt": "Buongiorno! Di cosa ha bisogno oggi?",
            "hint": "El panadero te saluda formalmente y pregunta qué necesitas.",
            "choices": [
              "Vorrei due cornetti alla crema, per favore.",
              "Desidero due cornetti alla crema, per piacere.",
              "Voglio due cornetti alla crema, per favore."
            ],
            "correct": 0,
            "explanation": "'Vorrei' es el condicional de cortesía educado.",
            "successLine": "Ecco i suoi cornetti! Desidera altro?",
            "failureLine": "Prego?"
          },
          {
            "prompt": "Li vuole farciti o vuoti?",
            "hint": "Pregunta si los quieres rellenos o vacíos.",
            "choices": [
              "Farciti, con crema.",
              "Relleni, con crema.",
              "Pieni, per favore."
            ],
            "correct": 0,
            "explanation": "'Farciti' es el término italiano para rellenos.",
            "successLine": "Ottima scelta! Sono appena sfornati.",
            "failureLine": "Non ho capito..."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Senti che profumo di focaccia calda! Ne prendi un pezzo?",
          "es": "¡Buenos días! ¡Siente qué olor a focaccia caliente! ¿Te llevas un trozo?"
        },
        "dialogue": [
          {
            "prompt": "Buongiorno! Senti che profumo di focaccia calda! Ne prendi un pezzo?",
            "hint": "Te ofrece un trozo de focaccia caliente.",
            "choices": [
              "Sì, vorrei un pezzo di focaccia calda.",
              "Sì, vorrei un pezzo di focaccia caldi.",
              "Sì, voglio un pezzo di focaccia calda."
            ],
            "correct": 0,
            "explanation": "'Calda' es caliente (femenino). Evita palabras españolas o impropias.",
            "successLine": "Ecco a Lei! Calda e filante. Sono cinque euro.",
            "failureLine": "Come dice?"
          },
          {
            "prompt": "Sono cinque euro.",
            "hint": "Indica el total: 5 euros. Paga con billete de 10.",
            "choices": [
              "Pago con una banconota da dieci euro. Ecco a Lei.",
              "Pago con un biglietto da dieci euro. Ecco a Lei.",
              "Pago con carta di credito, grazie."
            ],
            "correct": 0,
            "explanation": "Billete de dinero es 'banconota' (no 'biglietto', que es de transporte/cine).",
            "successLine": "Ecco il resto e lo scontrino. Arrivederci!",
            "failureLine": "Come paga?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Oggi abbiamo dei biscotti alle mandorle spettacolari. Vuoi provarli?",
          "es": "¡Hola! Hoy tenemos unas galletas de almendra espectaculares. ¿Quieres probarlas?"
        },
        "dialogue": [
          {
            "prompt": "Ciao! Oggi abbiamo dei biscotti alle mandorle spettacolari. Vuoi provarli?",
            "hint": "Te saluda cordialmente y te ofrece galletas de almendra.",
            "choices": [
              "Sì, ne vorrei due etti, per favore.",
              "Sì, ne voglio due cento grammi, per piacere.",
              "Sì, vorrei due etti di biscotti."
            ],
            "correct": 0,
            "explanation": "'Due etti' equivale a 200 gramos en la medida italiana de alimentos.",
            "successLine": "Perfetto! Gradisce anche del pane integrale?",
            "failureLine": "Quanti ne desidera?"
          },
          {
            "prompt": "Gradisce anche del pane integrale?",
            "hint": "Pregunta si quieres llevar pan integral.",
            "choices": [
              "Sì, una pagnotta fresca, grazie.",
              "Sì, un pane integrale, per favore.",
              "No, grazie. Va bene così."
            ],
            "correct": 0,
            "explanation": "'Una pagnotta fresca' es una hogaza de pan fresco.",
            "successLine": "D'accordo. Sono sei euro in totale.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Sono sei euro in totale.",
            "hint": "Te da el total de 6 euros.",
            "choices": [
              "Ecco a Lei. Tenga il resto.",
              "Ecco a te. Tenga il resto.",
              "Pago con bancomat. Ecco."
            ],
            "correct": 0,
            "explanation": "'Ecco a Lei' y 'tenga il resto' es la fórmula educada.",
            "successLine": "Grazie mille! Arrivederci!",
            "failureLine": "Prego?"
          }
        ]
      }
    ]
  },
  {
    "id": "mercato",
    "level": "A1",
    "place": "Mercato",
    "npc": "Venditrice Livia",
    "pos": {
      "x": -15.6,
      "z": 1.4
    },
    "color": "#5b8c61",
    "cefr": "A1",
    "skill": "interaction",
    "canDo": "Comprar fruta en un mercado",
    "grammar": [
      "articulo partitivo delle/dei",
      "quanto/quanti"
    ],
    "vocabTargets": [
      "mele",
      "arance",
      "fresche",
      "chilo",
      "vorrei"
    ],
    "communicativeFunction": "ordering",
    "errorTypes": [
      "article",
      "interference"
    ],
    "prerequisites": [],
    "greeting": {
      "it": "Buongiorno! Frutta fresca e verdura di stagione. Cosa desidera?",
      "es": "¡Buenos días! Fruta fresca y verdura de temporada. ¿Qué desea?"
    },
    "vocab": [
      {
        "it": "Mele",
        "es": "Manzanas"
      },
      {
        "it": "Arance",
        "es": "Naranjas"
      },
      {
        "it": "Vorrei",
        "es": "Quisiera"
      },
      {
        "it": "Quanto costa?",
        "es": "Cuanto cuesta?"
      },
      {
        "it": "Fresche",
        "es": "Frescas"
      }
    ],
    "dialogue": [
      {
        "prompt": "Vuole mele o arance?",
        "hint": "La vendedora ofrece manzanas o naranjas.",
        "choices": [
          "Vorrei delle mele, per favore.",
          "Voglio mele, per favore.",
          "Voglio mele, per piacere."
        ],
        "correct": 0,
        "explanation": "'Vorrei delle mele': quisiera unas manzanas. 'Delle' es el articulo partitivo.",
        "successLine": "Benissimo! Sono molto fresche oggi.",
        "failureLine": "Non ho capito... mele o arance?"
      },
      {
        "prompt": "Quanti chili ne vuole?",
        "hint": "Pregunta cuantos kilos quieres.",
        "choices": [
          "Un chilo, grazie.",
          "Uno kilo, per favore.",
          "Un kilo, per favore."
        ],
        "correct": 0,
        "explanation": "'Un chilo' (sin 'k') es la forma italiana correcta.",
        "successLine": "Ecco qua! Due euro, per favore.",
        "failureLine": "Scusi, non ho la bilancia per quella quantità."
      }
    ],
    "success": "Livia pesa le mele e te ne regala una extra per la gentilezza.",
    "failure": "Esci con un sacchetto pieno di limoni amari.",
    "reward": {
      "name": "Panino",
      "points": 15,
      "color": "#b9803a"
    },
    "failEvent": "badFood",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Di nuovo al mercato? Cosa Le serve oggi?",
          "es": "¡Buenos días! ¿De nuevo en el mercado? ¿Qué le hace falta hoy?"
        },
        "dialogue": [
          {
            "prompt": "Vuole delle arance fresche?",
            "hint": "Te ofrece naranjas frescas.",
            "choices": [
              "Sì, vorrei delle arance, per favore.",
              "Sì, voglio arance, per piacere.",
              "Sì, vorrei i arance, per favore."
            ],
            "correct": 0,
            "explanation": "'Delle arance' es el partitivo correcto (femenino plural antes de vocal).",
            "successLine": "Certo! Quante ne vuole?",
            "failureLine": "Non ho capito bene."
          },
          {
            "prompt": "Quanti chili ne vuole?",
            "hint": "Te pregunta la cantidad en kilos.",
            "choices": [
              "Un chilo, grazie.",
              "Uno chilo, per favore.",
              "Un kilo, grazie."
            ],
            "correct": 0,
            "explanation": "'Un chilo' es la forma correcta en italiano.",
            "successLine": "Ecco qua. Sono due euro in totale.",
            "failureLine": "Non ho capito."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Vuoi le solite mele o preferisci dell'altro?",
          "es": "¡Hola! ¿Quieres las manzanas de siempre o prefieres algo más?"
        },
        "dialogue": [
          {
            "prompt": "Vuoi delle banane mature?",
            "hint": "Te ofrece plátanos maduros.",
            "choices": [
              "Sì, vorrei delle banane, grazie.",
              "Sì, voglio banane, per favore.",
              "Sì, ne vorrei dei banane."
            ],
            "correct": 0,
            "explanation": "'Delle banane' es el partitivo femenino plural.",
            "successLine": "Ottimo. Quante ne prendi?",
            "failureLine": "Scusa?"
          },
          {
            "prompt": "Quante ne prendi?",
            "hint": "Te pregunta cuántos plátanos te llevas.",
            "choices": [
              "Ne prendo cinque, grazie.",
              "Prendo cinque banane, grazie.",
              "Voglio cinque, per favore."
            ],
            "correct": 0,
            "explanation": "'Ne prendo' utiliza el pronombre partitivo 'ne' de forma natural.",
            "successLine": "Ecco qui. Sono un euro e cinquanta centesimi.",
            "failureLine": "Quante?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Oggi abbiamo delle fragole spettacolari! Ne vuole provare un cestino?",
          "es": "¡Buenos días, hoy tenemos unas fresas espectaculares! ¿Quiere probar una cesta?"
        },
        "dialogue": [
          {
            "prompt": "Desidera un cestino di fragole fresche?",
            "hint": "Te ofrece una cesta de fresas frescas.",
            "choices": [
              "Sì, grazie. Quanto costano?",
              "Sì, per piacere. Quanto costa?",
              "Sì, le voglio. Quanto costano?"
            ],
            "correct": 0,
            "explanation": "Como es plural ('fragole'), se pregunta 'Quanto costano?'.",
            "successLine": "Costano tre euro al cestino.",
            "failureLine": "Come?"
          },
          {
            "prompt": "Costano tre euro al cestino. Ne vuole uno?",
            "hint": "Te confirma el precio de 3 euros y te pregunta si quieres una.",
            "choices": [
              "Sì, ne vorrei uno, grazie.",
              "Sì, voglio uno, per favore.",
              "Sì, lo prendo. Grazie."
            ],
            "correct": 0,
            "explanation": "'Ne vorrei uno' usa el pronombre 'ne' para referirse a la unidad del cestino.",
            "successLine": "Perfetto. Le serve anche un sacchetto?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Le serve anche un sacchetto?",
            "hint": "Te pregunta si necesitas una bolsa.",
            "choices": [
              "Sì, un sacchetto di carta, per favore.",
              "Sì, una borsa di plastica, grazie.",
              "No, grazie. Va bene così."
            ],
            "correct": 0,
            "explanation": "'Un sacchetto di carta' es la bolsa biodegradable común en mercados italianos.",
            "successLine": "Ecco a Lei. Arrivederci!",
            "failureLine": "Scusi?"
          }
        ]
      }
    ]
  },
  {
    "id": "parrucchiere",
    "level": "A2",
    "place": "Parrucchiere",
    "npc": "Toni il Barbiere",
    "pos": {
      "x": 15.7,
      "z": 8.8
    },
    "color": "#5fa6a7",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Dar instrucciones en la peluqueria",
    "grammar": [
      "imperativo formale Lei",
      "articulo partitivo un po'"
    ],
    "vocabTargets": [
      "capelli",
      "tagliare",
      "un po'",
      "spuntatina",
      "barba"
    ],
    "communicativeFunction": "giving-instructions",
    "errorTypes": [
      "article",
      "interference"
    ],
    "prerequisites": [
      "caffe"
    ],
    "greeting": {
      "it": "Buongiorno! Benvenuto nel mio salone. Come posso aiutarti oggi?",
      "es": "¡Buenos días! Bienvenido a mi salón. ¿Cómo puedo ayudarte hoy?"
    },
    "vocab": [
      {
        "it": "Capelli",
        "es": "Cabello"
      },
      {
        "it": "Tagliare",
        "es": "Cortar"
      },
      {
        "it": "Un po'",
        "es": "Un poco"
      },
      {
        "it": "Accorciare",
        "es": "Acortar"
      },
      {
        "it": "Pettine",
        "es": "Peine"
      }
    ],
    "dialogue": [
      {
        "prompt": "Come vuole tagliare i capelli?",
        "hint": "El peluquero pregunta como quieres el corte.",
        "choices": [
          "Solo un po', per favore.",
          "Solamente un pochino, per favore.",
          "Solo un poco, per piacere."
        ],
        "correct": 0,
        "explanation": "'Solo un po'' significa 'solo un poco'. Perfecto para evitar cambios extremos.",
        "successLine": "Va bene! Solo una spuntatina allora.",
        "failureLine": "Come? Può ripetere?"
      },
      {
        "prompt": "Vuole anche la barba?",
        "hint": "Pregunta si tambien quieres arreglo de barba.",
        "choices": [
          "No, solo i capelli, grazie.",
          "No, solo il capello, grazie.",
          "No, solo la barba no, per favore."
        ],
        "correct": 0,
        "explanation": "'Solo i capelli' es la respuesta natural: 'solo el cabello'.",
        "successLine": "Perfetto! Dieci minuti ed è pronto!",
        "failureLine": "Ho capito male... ricominciamo da capo."
      }
    ],
    "success": "Toni sistema la tua pettinatura con precisione millimetrica.",
    "failure": "Toni capisce qualcosa di strano e ti lascia un taglio blu temporaneo.",
    "reward": {
      "name": "Gelato",
      "points": 25,
      "color": "#e7b6c9"
    },
    "failEvent": "badHair",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Hai bisogno di tagliare i capelli oggi?",
          "es": "¡Buenos días! ¿Necesitas cortarte el pelo hoy?"
        },
        "dialogue": [
          {
            "prompt": "Si accomodi. Come li vuole i capelli oggi?",
            "hint": "Pregunta cómo quieres el pelo. Di cortos a los lados y un poco largos arriba.",
            "choices": [
              "Corti ai lati e un po' lunghi sopra.",
              "Corti ai lati e un poco lunghi sopra.",
              "Corti a i lati e un po' lunghi sopra."
            ],
            "correct": 0,
            "explanation": "'Un po'' es la forma habitual; y 'ai lati' (a + i).",
            "successLine": "Perfetto. Le lavo prima i capelli?",
            "failureLine": "Non ho capito, mi spieghi meglio."
          },
          {
            "prompt": "Vuole che le sistemi anche la barba?",
            "hint": "Ofrece arreglar la barba. Pídele (formal) que te la recorte un poco.",
            "choices": [
              "Sì, me la accorci un po', per favore.",
              "Sì, me la accorcia un po', per favore.",
              "Sì, mi accorci un po' di barba."
            ],
            "correct": 0,
            "explanation": "Imperativo formal 'me la accorci' (Lei); el pronombre 'la' se refiere a 'la barba'.",
            "successLine": "Va bene! Tra poco è tutto pronto.",
            "failureLine": "Come dice? Solo i capelli allora?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Ti vedo con i capelli molto lunghi. Li accorciamo?",
          "es": "¡Hola! Te veo con el pelo muy largo. ¿Lo acortamos?"
        },
        "dialogue": [
          {
            "prompt": "Li laviamo prima di tagliare?",
            "hint": "Pregunta si los lavamos antes de cortar.",
            "choices": [
              "Sì, grazie. Con lo shampoo delicato.",
              "Sì, per favore. Con il sapone delicato.",
              "Sì, grazie. Lavami con lo shampoo."
            ],
            "correct": 0,
            "explanation": "Se usa 'shampoo' en peluquerías, no 'sapone' (jabón corporal).",
            "successLine": "Ottimo. E per il taglio?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Come facciamo la sfumatura dietro?",
            "hint": "Pregunta cómo hacemos el degradado detrás.",
            "choices": [
              "La faccia sfumata corta, per favore.",
              "La fa corta sfumata, per favore.",
              "Falla sfumata corta, grazie."
            ],
            "correct": 0,
            "explanation": "El subjuntivo de cortesía formal es 'la faccia' (hágalo).",
            "successLine": "Va bene, procediamo!",
            "failureLine": "Come?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Oggi facciamo un cambio di look completo?",
          "es": "¡Buenos días! ¿Hoy hacemos un cambio de look completo?"
        },
        "dialogue": [
          {
            "prompt": "Che tipo di taglio preferisce per questo stile?",
            "hint": "Pregunta qué tipo de corte prefieres para este estilo.",
            "choices": [
              "Vorrei un taglio moderno, corto ai lati.",
              "Voglio un taglio moderno, corto ai lati.",
              "Desidero un taglio moderno, corto ai lati."
            ],
            "correct": 0,
            "explanation": "'Vorrei' es el condicional cortés adecuado para pedir un corte.",
            "successLine": "Perfetto. E per lo styling finale?",
            "failureLine": "Come dice?"
          },
          {
            "prompt": "Va bene. Vuole che metta della cera o del gel alla fine?",
            "hint": "Te pregunta si aplica cera o gel al final.",
            "choices": [
              "Un po' di cera, grazie.",
              "Metta gel, per favore.",
              "Un poco di cera, per piacere."
            ],
            "correct": 0,
            "explanation": "'Un po' di cera' es la expresión idiomática correcta en italiano.",
            "successLine": "Ecco fatto. Sono quindici euro in totale.",
            "failureLine": "Non ho capito."
          }
        ]
      }
    ]
  },
  {
    "id": "stazione",
    "level": "A2",
    "place": "Stazione",
    "npc": "Agente Ricci",
    "pos": {
      "x": -19.8,
      "z": 16.2
    },
    "color": "#8c7b68",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Pedir y entender direcciones de transporte",
    "grammar": [
      "preposiciones articuladas al/alla",
      "dove + verbo"
    ],
    "vocabTargets": [
      "binario",
      "treno",
      "biglietto",
      "orario",
      "convalidare"
    ],
    "communicativeFunction": "asking-directions",
    "errorTypes": [
      "interference",
      "preposition"
    ],
    "prerequisites": [
      "panetteria",
      "caffe"
    ],
    "greeting": {
      "it": "Buongiorno. Stazione Centrale. Come posso esserle utile?",
      "es": "¡Buenos días! Estación Central. ¿Cómo puedo serle útil?"
    },
    "vocab": [
      {
        "it": "Binario",
        "es": "Anden"
      },
      {
        "it": "Treno",
        "es": "Tren"
      },
      {
        "it": "Biglietto",
        "es": "Billete"
      },
      {
        "it": "Orario",
        "es": "Horario"
      },
      {
        "it": "Partenza",
        "es": "Salida"
      }
    ],
    "dialogue": [
      {
        "prompt": "Per il centro, prenda il binario due.",
        "hint": "El agente indica que para el centro debes tomar el anden dos.",
        "choices": [
          "Grazie, vado al binario due.",
          "Grazie, vado alla piattaforma due.",
          "Grazie, vado a il binario due."
        ],
        "correct": 0,
        "explanation": "'Binario due' significa anden dos. 'Grazie, vado al...' es 'Gracias, voy al...'",
        "successLine": "Esatto! Il treno arriva tra cinque minuti.",
        "failureLine": "No, guardi meglio il tabellone degli orari."
      },
      {
        "prompt": "Ha già il biglietto?",
        "hint": "Pregunta si ya tienes el billete.",
        "choices": [
          "No, dove posso comprarlo?",
          "No, dove posso a comprarlo?",
          "Non ancora. Dove si compra?"
        ],
        "correct": 0,
        "explanation": "'Dove posso comprarlo?' = 'Donde puedo comprarlo?' es la forma mas natural.",
        "successLine": "Alla biglietteria automatica, laggiù in fondo.",
        "failureLine": "Deve convalidarlo prima di salire sul treno."
      }
    ],
    "success": "Arrivi al binario giusto e sblocchi una nueva rotta.",
    "failure": "Confondi il binario e finisci dall'altra parte della stazione.",
    "reward": {
      "name": "Pizza",
      "points": 20,
      "color": "#e1b041"
    },
    "failEvent": "wrongPlatform",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno, serve una mano con gli orari dei treni?",
          "es": "¡Buenos días! ¿Necesita una mano con los horarios de los trenes?"
        },
        "dialogue": [
          {
            "prompt": "Il treno per Firenze parte dal binario quattro. Ha bisogno d'altro?",
            "hint": "El agente informa el andén y ofrece más ayuda. Pregunta por la hora.",
            "choices": [
              "Sì, a che ora parte esattamente?",
              "Sì, a che ora parte di preciso?",
              "Sì, quando parte il treno alle?"
            ],
            "correct": 0,
            "explanation": "'A che ora parte?' es la forma estándar de preguntar el horario; 'di preciso' es un calco del español.",
            "successLine": "Alle 14:30. Le conviene convalidare subito il biglietto.",
            "failureLine": "Come? Non ho capito bene la domanda."
          },
          {
            "prompt": "Ha già convalidato il biglietto alla macchinetta?",
            "hint": "Pregunta si validaste el billete. Dile que lo validas en el andén.",
            "choices": [
              "No, lo convalido adesso al binario.",
              "No, lo convalido adesso allo binario.",
              "No, lo convalido adesso nel binario."
            ],
            "correct": 0,
            "explanation": "'Al binario' (a + il). 'Binario' es masculino: no lleva 'allo' ni 'nel'.",
            "successLine": "Perfetto. Buon viaggio!",
            "failureLine": "Attento: senza convalida rischia una multa."
          }
        ]
      },
      {
        "greeting": {
          "it": "Salve, cerca il treno per Roma o per Milano?",
          "es": "¡Hola! ¿Busca el tren para Roma o para Milán?"
        },
        "dialogue": [
          {
            "prompt": "Il treno per Roma parte tra dieci minuti.",
            "hint": "Te indica que el tren a Roma sale en 10 minutos. Pregunta por el andén.",
            "choices": [
              "Da quale binario parte?",
              "Da che piattaforma parte?",
              "Da dove binario parte?"
            ],
            "correct": 0,
            "explanation": "'Binario' es la palabra para andén de tren. Usamos 'quale' para preguntar por la opción específica.",
            "successLine": "Dal binario tre. Affrettati!",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Deve convalidare il biglietto alle macchinette gialle.",
            "hint": "Te recuerda validar el billete en las máquinas.",
            "choices": [
              "Sì, lo convalido subito. Grazie!",
              "Sì, lo timbro subito. Grazie!",
              "Sì, lo marco subito. Grazie."
            ],
            "correct": 0,
            "explanation": "'Convalidare' o 'timbrare' son los verbos correctos para validar billetes en Italia.",
            "successLine": "Ottimo. Buon viaggio!",
            "failureLine": "È obbligatorio farlo."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno. Biglietteria della stazione. Che destinazione desidera?",
          "es": "¡Buenos días! Taquilla de la estación. ¿Qué destino desea?"
        },
        "dialogue": [
          {
            "prompt": "Desidera un biglietto di sola andata o anche il ritorno?",
            "hint": "Te pregunta si quieres boleto de solo ida o también vuelta.",
            "choices": [
              "Andata e ritorno in seconda classe, per favore.",
              "Andata e vuelta in seconda classe, per favore.",
              "Andata e ritorno in secondo classe, per favore."
            ],
            "correct": 0,
            "explanation": "'Andata e ritorno' es ida y vuelta. 'Seconda classe' es femenino.",
            "successLine": "Ottimo. Sono venti euro.",
            "failureLine": "Prego?"
          },
          {
            "prompt": "Sono venti euro. Paga con carta o contanti?",
            "hint": "Te indica el total y pregunta la forma de pago.",
            "choices": [
              "Pago con carta. Posso contactless?",
              "Pago con carta. Posso senza contatto?",
              "Pago con carta. Funziona contactless?"
            ],
            "correct": 0,
            "explanation": "'Posso contactless?' es común y aceptado en todas las terminales italianas.",
            "successLine": "Certamente. Transazione eseguita. Ecco i biglietti!",
            "failureLine": "Errore di lettura."
          }
        ]
      }
    ]
  },
  {
    "id": "farmacia",
    "level": "A2",
    "place": "Farmacia",
    "npc": "Dottoressa Elena",
    "pos": {
      "x": 0.6,
      "z": 18.5
    },
    "color": "#78b36c",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Describir sintomas en una farmacia",
    "grammar": [
      "avere mal di + sustantivo",
      "articulo indeterminativo un/una/un'"
    ],
    "vocabTargets": [
      "sintomi",
      "mal di testa",
      "febbre",
      "allergia",
      "farmaco"
    ],
    "communicativeFunction": "describing",
    "errorTypes": [
      "conjugation",
      "interference"
    ],
    "prerequisites": [
      "panetteria"
    ],
    "greeting": {
      "it": "Buongiorno. Farmacia Comunale. Come posso aiutarla?",
      "es": "¡Buenos días! Farmacia Comunal. ¿Cómo puedo ayudarle?"
    },
    "vocab": [
      {
        "it": "Sintomi",
        "es": "Sintomas"
      },
      {
        "it": "Mal di testa",
        "es": "Dolor de cabeza"
      },
      {
        "it": "Febbre",
        "es": "Fiebre"
      },
      {
        "it": "Farmaco",
        "es": "Medicamento"
      },
      {
        "it": "Ricetta",
        "es": "Receta"
      }
    ],
    "dialogue": [
      {
        "prompt": "Che sintomi ha?",
        "hint": "La doctora pregunta que sintomas tienes.",
        "choices": [
          "Ho mal di testa e un po' di febbre.",
          "Ho mal di testa e febbre.",
          "Ho dolore di testa e febbre."
        ],
        "correct": 0,
        "explanation": "'Ho mal di testa' es la expresion correcta. 'Un po' di febbre' = un poco de fiebre.",
        "successLine": "Da quanto tempo? Da ieri?",
        "failureLine": "Mi descriva meglio i sintomi, per favore."
      },
      {
        "prompt": "È allergico a qualche farmaco?",
        "hint": "Pregunta si eres allergico a algun medicamento.",
        "choices": [
          "No, nessuna allergia.",
          "No, nessuno allergia.",
          "Non sono allergico a niente."
        ],
        "correct": 0,
        "explanation": "'Nessuna allergia' es la respuesta mas directa y correcta.",
        "successLine": "Bene. Le prescrivo un analgesico leggero.",
        "failureLine": "Devo saperlo per sicurezza. Ci riprovi."
      }
    ],
    "success": "Elena ti dà una raccomandazione chiara e recuperi energia.",
    "failure": "Ti porti via uno sciroppo sbagliato e tutto gira per qualche secondo.",
    "reward": {
      "name": "Malteada",
      "points": 40,
      "color": "#d8c3ff"
    },
    "failEvent": "dizzy",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Ha bisogno di qualcosa per la salute?",
          "es": "¡Buenos días! ¿Necesita algo para la salud?"
        },
        "dialogue": [
          {
            "prompt": "Mi dica, cosa la disturba oggi?",
            "hint": "La doctora pregunta qué te molesta. Describe dolor de garganta y tos.",
            "choices": [
              "Ho mal di gola e la tosse da due giorni.",
              "Ho un mal di gola e tosse da due giorni.",
              "Tengo mal di gola e tosse da due giorni."
            ],
            "correct": 0,
            "explanation": "'Ho mal di gola' — 'avere mal di' va sin artículo indeterminado; y se usa 'avere' (ho), no 'tenere'.",
            "successLine": "Le do uno sciroppo. Prende già altri farmaci?",
            "failureLine": "Scusi, può ripetere i sintomi?"
          },
          {
            "prompt": "Prende già altri farmaci in questo periodo?",
            "hint": "Pregunta si tomas otros medicamentos. Responde que ninguno más.",
            "choices": [
              "No, nessun altro farmaco.",
              "No, nessun'altro farmaco.",
              "No, niente altri farmaci."
            ],
            "correct": 0,
            "explanation": "'Nessun altro farmaco' — 'nessun' se apocopa ante masculino sin apóstrofo.",
            "successLine": "Perfetto. Prenda lo sciroppo tre volte al giorno.",
            "failureLine": "È importante saperlo, ci pensi bene."
          }
        ]
      },
      {
        "greeting": {
          "it": "Salve. Di cosa ha bisogno? Ricetta medica o farmaci da banco?",
          "es": "¡Hola! ¿Qué necesita? ¿Receta médica o medicamentos de venta libre?"
        },
        "dialogue": [
          {
            "prompt": "Cosa desidera ordinare con questo foglio del medico?",
            "hint": "Te pregunta por la prescripción que tienes en la mano.",
            "choices": [
              "Ecco la ricetta per l'antibiotico, dottoressa.",
              "Ecco la prescrizione per l'antibiotico, dottoressa.",
              "Ecco il foglio per l'antibiotico."
            ],
            "correct": 0,
            "explanation": "'La ricetta' es el término médico estándar en Italia para las recetas de medicamentos.",
            "successLine": "Bene. Lo deve assumere due volte al giorno a stomaco pieno.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Lo deve assumere due volte al giorno a stomaco pieno.",
            "hint": "Te da las instrucciones y tú confirmas si es antes o después de comer.",
            "choices": [
              "D'accordo. Devo prenderlo dopo i pasti?",
              "D'accordo. Devo prenderlo prima dei pasti?",
              "D'accordo. Lo mangio con cibo?"
            ],
            "correct": 0,
            "explanation": "'A stomaco pieno' significa con comida en el estómago, es decir, después de comer ('dopo i pasti').",
            "successLine": "Esatto, proprio così. Ecco il farmaco.",
            "failureLine": "No, attenzione."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Come si sente oggi? Ha dei sintomi particolari?",
          "es": "¡Buenos días! ¿Cómo se siente hoy? ¿Tiene síntomas particulares?"
        },
        "dialogue": [
          {
            "prompt": "Ho un forte mal di gola e ho perso la voce.",
            "hint": "Explica tu síntoma de dolor de gola y afonía y pide opciones.",
            "choices": [
              "Mi consiglia uno sciroppo o delle pastiglie?",
              "Mi raccomanda uno sciroppo o pastiglie?",
              "Cosa c'è per questo dolore?"
            ],
            "correct": 0,
            "explanation": "'Consigliare' es el verbo adecuado. 'Delle pastiglie' usa el partitivo para pastillas.",
            "successLine": "Queste pastiglie per la gola sono ottime. Ne prenda una ogni quattro ore.",
            "failureLine": "Prego?"
          },
          {
            "prompt": "Ne prenda una ogni quattro ore. Serve altro?",
            "hint": "Te da las pastillas y te pregunta si necesitas algo más. Pregunta si requiere receta.",
            "choices": [
              "Serve la ricetta per queste pastiglie?",
              "C'è bisogno di ricetta per queste pastiglie?",
              "Serve prescrizione per queste?"
            ],
            "correct": 0,
            "explanation": "'Serve la ricetta...?' es la forma común y directa para preguntar si requiere prescripción médica.",
            "successLine": "No, queste sono senza ricetta. Sono otto euro in tutto.",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "negozio",
    "level": "A2",
    "place": "Negozio di vestiti",
    "npc": "Commessa Giulia",
    "pos": {
      "x": -20.4,
      "z": -16.4
    },
    "color": "#a66f9f",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Comprar ropa y expresar preferencias",
    "grammar": [
      "verbo portare per taglie",
      "preferire + articulo"
    ],
    "vocabTargets": [
      "taglia",
      "portare",
      "prova",
      "colore",
      "preferisco"
    ],
    "communicativeFunction": "shopping",
    "errorTypes": [
      "conjugation",
      "interference"
    ],
    "prerequisites": [
      "caffe",
      "mercato"
    ],
    "greeting": {
      "it": "Buongiorno! Benvenuto nel nostro negozio. Dai un'occhiata pure!",
      "es": "¡Buenos días! Bienvenido a nuestra tienda. ¡Eche un vistazo!"
    },
    "vocab": [
      {
        "it": "Taglia",
        "es": "Talla"
      },
      {
        "it": "Portare",
        "es": "Usar/Llevar"
      },
      {
        "it": "Media",
        "es": "Mediana"
      },
      {
        "it": "Prova",
        "es": "Prueba/Probador"
      },
      {
        "it": "Colore",
        "es": "Color"
      }
    ],
    "dialogue": [
      {
        "prompt": "Che taglia porta?",
        "hint": "La dependienta pregunta que talla usas.",
        "choices": [
          "Porto una taglia media.",
          "Uso una taglia media.",
          "Porto una taglia mediana."
        ],
        "correct": 0,
        "explanation": "'Porto una taglia media' es la expresion correcta. 'Portare' se usa para tallas.",
        "successLine": "Perfetto! Abbiamo questa giacca nella sua taglia.",
        "failureLine": "Mi dispiace, non abbiamo quella taglia in questo modello."
      },
      {
        "prompt": "Le piace questo colore o preferisce il blu?",
        "hint": "Pregunta si te gusta este color o prefieres el azul.",
        "choices": [
          "Preferisco il blu, grazie.",
          "Prefero il blu, grazie.",
          "Meglio il blu, per piacere."
        ],
        "correct": 0,
        "explanation": "'Preferisco' (con 'sc') es la conjugacion correcta. 'Prefero' no existe en italiano.",
        "successLine": "Buona scelta! Il blu le sta molto bene.",
        "failureLine": "Non abbiamo questo colore in magazzino."
      }
    ],
    "success": "Giulia trova una giacca che si abbina al tuo look.",
    "failure": "Esci con colori mescolati che non avevi chiesto.",
    "reward": {
      "name": "Hotdog",
      "points": 30,
      "color": "#d8993e"
    },
    "failEvent": "badOutfit",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Cerca qualcosa in particolare o dà solo un'occhiata?",
          "es": "¡Buenos días! ¿Busca algo en particular o solo echa un vistazo?"
        },
        "dialogue": [
          {
            "prompt": "Cerca qualcosa per un'occasione particolare?",
            "hint": "Pregunta si buscas algo especial. Di que buscas una camisa elegante.",
            "choices": [
              "Sì, cerco una camicia elegante.",
              "Sì, cerco una camicia di elegante.",
              "Sì, cerco una elegante camicia."
            ],
            "correct": 0,
            "explanation": "El adjetivo calificativo va después del sustantivo, sin preposición: 'camicia elegante'.",
            "successLine": "Che taglia porta di solito?",
            "failureLine": "Non ho capito, che tipo cerca?"
          },
          {
            "prompt": "Questa le piace? La abbiamo in due colori.",
            "hint": "Te ofrece la prenda en dos colores. Di que la prefieres en verde.",
            "choices": [
              "La preferisco in verde, se possibile.",
              "La prefero in verde, se possibile.",
              "La preferisco di verde, se possibile."
            ],
            "correct": 0,
            "explanation": "'Preferisco' (verbo preferire) + 'in verde' para el color. 'Prefero' no existe.",
            "successLine": "Ottima scelta! Vuole provarla?",
            "failureLine": "Mi dispiace, quel colore è esaurito."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Abbiamo dei nuovi arrivi di stagione. Vuoi provare qualcosa?",
          "es": "¡Hola! Tenemos nuevas llegadas de temporada. ¿Quieres probarte algo?"
        },
        "dialogue": [
          {
            "prompt": "Vuoi provare questa camicia di cotone?",
            "hint": "Te ofrece probarte la camisa y tú preguntas por los probadores.",
            "choices": [
              "Sì, dove sono i camerini?",
              "Sì, dove sono le prove?",
              "Sì, dove posso provarla?"
            ],
            "correct": 0,
            "explanation": "'I camerini' son los probadores de ropa en italiano.",
            "successLine": "I camerini sono in fondo a destra. Ti serve un'altra taglia?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "I camerini sono in fondo a destra. Ti serve un'altra taglia?",
            "hint": "Te indica dónde están y pregunta si necesitas otra talla.",
            "choices": [
              "Questa taglia va bene, grazie.",
              "Questo taglia va bene, grazie.",
              "Questa dimensione va bene."
            ],
            "correct": 0,
            "explanation": "'Taglia' es femenino singular: 'questa taglia'.",
            "successLine": "Perfetto. Se hai bisogno di altro, sono qui.",
            "failureLine": "Come?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Cerca un abito per un'occasione speciale?",
          "es": "¡Buenos días! ¿Busca un traje para una ocasión especial?"
        },
        "dialogue": [
          {
            "prompt": "Abbiamo questo vestito elegante in saldo al trenta percento.",
            "hint": "Te ofrece un vestido de oferta y tú preguntas si puedes probártelo.",
            "choices": [
              "Ottimo! Posso provarlo, per favore?",
              "Ottimo! Posso vestirlo, per favore?",
              "Bello! Posso usarlo?"
            ],
            "correct": 0,
            "explanation": "'Provarlo' es el verbo adecuado para probarse una prenda.",
            "successLine": "Certamente! Il camerino è libero. Come le sta?",
            "failureLine": "Non è possibile."
          },
          {
            "prompt": "Le sta benissimo! Come desidera pagare?",
            "hint": "Te felicita y te pregunta cómo quieres pagar.",
            "choices": [
              "Pago con la carta di credito, grazie.",
              "Pago in carta di credito, grazie.",
              "Pago con i soldi di plastica."
            ],
            "correct": 0,
            "explanation": "'Pago con la carta...' es la preposición correcta en italiano.",
            "successLine": "Ottimo. Ecco lo scontrino. Buona giornata!",
            "failureLine": "Transazione fallita."
          }
        ]
      }
    ]
  },
  {
    "id": "ristorante",
    "level": "B1",
    "place": "Ristorante",
    "npc": "Cameriere Paolo",
    "pos": {
      "x": 22.5,
      "z": -18.2
    },
    "color": "#b0493b",
    "cefr": "B1",
    "skill": "interaction",
    "canDo": "Ordenar comida en un restaurante y manejar reservas",
    "grammar": [
      "preposizione a nome di",
      "condizionale vorrei/prenderei"
    ],
    "vocabTargets": [
      "prenotato",
      "ordinato",
      "conto",
      "piatto",
      "volentieri"
    ],
    "communicativeFunction": "ordering",
    "errorTypes": [
      "preposition",
      "register"
    ],
    "prerequisites": [
      "parrucchiere",
      "negozio"
    ],
    "greeting": {
      "it": "Buongiorno, benvenuto al Ristorante Bella Vista. Ha prenotato?",
      "es": "¡Buenos días! Bienvenido al Restaurante Bella Vista. ¿Ha reservado?"
    },
    "vocab": [
      {
        "it": "Ordinato",
        "es": "Pedido"
      },
      {
        "it": "Piatto",
        "es": "Plato"
      },
      {
        "it": "Conto",
        "es": "Cuenta"
      },
      {
        "it": "Prenotato",
        "es": "Reservado"
      },
      {
        "it": "Cameriere",
        "es": "Mesero"
      }
    ],
    "dialogue": [
      {
        "prompt": "Ha prenotato un tavolo?",
        "hint": "El mesero pregunta si reservaste mesa.",
        "choices": [
          "Sì, a nome di {name}.",
          "Sì, in nome di {name}.",
          "Sì, nel nome di {name}."
        ],
        "correct": 0,
        "explanation": "'A nome di' es la preposicion correcta para 'a nombre de'.",
        "successLine": "Ah, ecco! Il suo tavolo è vicino alla finestra.",
        "failureLine": "Non trovo la sua prenotazione. Ha il numero di conferma?"
      },
      {
        "prompt": "Ha già deciso cosa ordinare?",
        "hint": "Pregunta si ya decidiste que pedir.",
        "choices": [
          "Prendo gli spaghetti al pomodoro.",
          "Prendo i spaghetti al pomodoro.",
          "Voglio spaghetti con pomodoro."
        ],
        "correct": 0,
        "explanation": "'Prendo gli spaghetti...' = 'Tomare los espaguetis...' usando el articulo correcto 'gli'.",
        "successLine": "Ottima scelta! E da bere?",
        "failureLine": "Quel piatto non è disponibile oggi, mi dispiace."
      },
      {
        "prompt": "Desidera anche il dolce? Abbiamo tiramisù.",
        "hint": "Ofrece postre: tiramisù.",
        "choices": [
          "Sì, volentieri! Un tiramisù.",
          "Sì, certo. Un tiramisù.",
          "Sì, con piacere. Uno tiramisù."
        ],
        "correct": 0,
        "explanation": "'Volentieri' expresa aceptacion con entusiasmo. El articulo 'un' es correcto con tiramisù.",
        "successLine": "Arriva subito! Buon appetito!",
        "failureLine": "Il dolce è finito purtroppo. Vuole un caffè?"
      }
    ],
    "success": "Paolo porta il tuo ordine correctamente e la cena es deliziosa.",
    "failure": "Paolo lascia una pizza con olive nere e salsa verde brillante.",
    "reward": {
      "name": "Hamburguesa",
      "points": 30,
      "color": "#a96c38"
    },
    "failEvent": "badFood",
    "progression": [
      {
        "greeting": {
          "it": "Buonasera! Benvenuto. Ha una prenotazione per stasera?",
          "es": "¡Buenas noches! Bienvenido. ¿Tiene una reserva para esta noche?"
        },
        "dialogue": [
          {
            "prompt": "Mi dispiace, senza prenotazione c'è da attendere. Le va di aspettare al bar?",
            "hint": "No hay reserva y hay que esperar. Acepta y pide un aperitivo mientras tanto.",
            "choices": [
              "Volentieri, prenderei un aperitivo intanto.",
              "Volentieri, prenderei un aperitivo per intanto.",
              "Va bene, voglio un aperitivo."
            ],
            "correct": 0,
            "explanation": "El condicional 'prenderei' suaviza la petición; 'intanto' (mientras tanto) va sin preposición.",
            "successLine": "Prego, si accomodi al bancone. Ecco il menù.",
            "failureLine": "Come preferisce, il tavolo sarà pronto a breve."
          },
          {
            "prompt": "Cosa le porto da bere con il pasto?",
            "hint": "Pregunta qué quieres beber. Pide una botella de agua natural.",
            "choices": [
              "Vorrei una bottiglia d'acqua naturale.",
              "Vorrei una bottiglia di acqua naturale.",
              "Voglio una bottiglia d'acqua naturale."
            ],
            "correct": 0,
            "explanation": "'D'acqua' con elisión suena más natural; 'vorrei' mantiene el registro cortés.",
            "successLine": "Certo. Ha già scelto il piatto principale?",
            "failureLine": "Arriva subito."
          },
          {
            "prompt": "Desidera altro o le porto il conto?",
            "hint": "Pregunta si deseas algo más. Pide la cuenta y ofrece pagar con tarjeta.",
            "choices": [
              "Il conto, per favore. Posso pagare con carta?",
              "La conta, per favore. Posso pagare con carta?",
              "Il conto, per favore. Posso pagare in carta?"
            ],
            "correct": 0,
            "explanation": "Es 'il conto' (masculino) y se paga 'con carta' (instrumento con 'con').",
            "successLine": "Certo. Ecco il POS. Grazie e a presto!",
            "failureLine": "Un attimo che sistemo."
          }
        ]
      },
      {
        "greeting": {
          "it": "Salve! Siete in due? Accomodatevi al tavolo vicino alla terrazza.",
          "es": "¡Hola! ¿Son dos? Acomódense en la mesa cerca de la terraza."
        },
        "dialogue": [
          {
            "prompt": "Cosa desidera come antipasto?",
            "hint": "Te pregunta qué deseas como plato de entrada.",
            "choices": [
              "Prendo un antipasto di mare da dividere.",
              "Prendo un antipasto di mare da condividere.",
              "Prendiamo un antipasto per due."
            ],
            "correct": 0,
            "explanation": "'Da dividere' es la forma idiomática más común para compartir un plato al ordenar.",
            "successLine": "Ottimo! E come secondo piatto? Carne o pesce?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "E come secondo piatto? Carne o pesce?",
            "hint": "Te ofrece carne o pescado.",
            "choices": [
              "Preferisco la grigliata di pesce, grazie.",
              "Prefero la grigliata di pesce, grazie.",
              "Prendo pesce grigliato, per favore."
            ],
            "correct": 0,
            "explanation": "'Preferisco' es la conjugación regular de 'preferire'.",
            "successLine": "Perfetto. E per accompagnare?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Gradisce del vino della casa per accompagnare?",
            "hint": "Te ofrece vino de la casa para acompañar.",
            "choices": [
              "Sì, un quarto di vino bianco, per favore.",
              "Sì, un quarto vino bianco, per favore.",
              "Sì, vino bianco un quarto, per favore."
            ],
            "correct": 0,
            "explanation": "'Un quarto di...' expresa la medida de volumen de vino en jarras de restaurantes tradicionales italianos.",
            "successLine": "Arriva subito. Buon appetito!",
            "failureLine": "Finito."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buonasera! Benvenuto al nostro ristorante. Avete allergie o intolleranze?",
          "es": "¡Buenas noches! Bienvenido a nuestro restaurante. ¿Tienen alergias o intolerancias?"
        },
        "dialogue": [
          {
            "prompt": "Avete richieste particolari per la preparazione?",
            "hint": "Te pregunta si tienes alguna intolerancia o requerimiento alimentario.",
            "choices": [
              "Sì, sono intollerante al glutine.",
              "Sì, ho allergia di glutine.",
              "Sì, non posso mangiare glutine."
            ],
            "correct": 0,
            "explanation": "'Sono intollerante al...' es la estructura médica y de servicio para intolerancias alimenticias en Italia.",
            "successLine": "Non si preoccupi, abbiamo piatti dedicati senza glutine.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Non si preoccupi, abbiamo piatti dedicati senza glutine. Cosa sceglie?",
            "hint": "Te ofrece opciones sin gluten y pregunta qué eliges.",
            "choices": [
              "Prendo la lasagna senza glutine, grazie.",
              "Prendo lasagna senza glutine, per piacere.",
              "Voglio la lasagna senza glutine, per favore."
            ],
            "correct": 0,
            "explanation": "'Prendo la lasagna...' es la forma elegante de pedir incluyendo el artículo determinativo.",
            "successLine": "Molto bene. Le porto subito la lasagna.",
            "failureLine": "Non disponibile."
          },
          {
            "prompt": "Ecco il conto. Il servizio è incluso.",
            "hint": "Te da la cuenta del restaurante y tú pagas preguntando por la propina.",
            "choices": [
              "Tenga la carta. Posso lasciare la mancia?",
              "Ecco la carta. Posso lasciare mancia?",
              "Tenga il resto. Grazie di tutto."
            ],
            "correct": 0,
            "explanation": "'La mancia' es la propina en italiano. Usar el artículo determinativo 'la' es correcto.",
            "successLine": "Grazie mille! Gentilissimo. Arrivederci!",
            "failureLine": "Transazione fallita."
          }
        ]
      }
    ]
  },
  {
    "id": "parco",
    "level": "B1",
    "place": "Parco",
    "npc": "Studente Nico",
    "pos": {
      "x": -3.2,
      "z": -24.5
    },
    "color": "#4f8a76",
    "cefr": "B1",
    "skill": "interaction",
    "canDo": "Hacer y aceptar invitaciones sociales informales",
    "grammar": [
      "condizionale mi piacerebbe",
      "preposizioni di tempo a/alle"
    ],
    "vocabTargets": [
      "volentieri",
      "più tardi",
      "a che ora",
      "impegnato",
      "d'accordo"
    ],
    "communicativeFunction": "inviting",
    "errorTypes": [
      "register",
      "interference"
    ],
    "prerequisites": [
      "farmacia",
      "stazione"
    ],
    "greeting": {
      "it": "Ciao! Che bella giornata per stare al parco. Ti va di fare due chiacchiere?",
      "es": "¡Hola! Qué hermoso día para estar en el parque. ¿Te apetece charlar un poco?"
    },
    "vocab": [
      {
        "it": "Volentieri",
        "es": "Con gusto"
      },
      {
        "it": "Più tardi",
        "es": "Mas tarde"
      },
      {
        "it": "A che ora?",
        "es": "A que hora?"
      },
      {
        "it": "Impegnato",
        "es": "Ocupado"
      },
      {
        "it": "D'accordo",
        "es": "De acuerdo"
      }
    ],
    "dialogue": [
      {
        "prompt": "Ti va di prendere un caffè più tardi?",
        "hint": "Nico pregunta si te apetece tomar un cafe mas tarde.",
        "choices": [
          "Sì, volentieri. A che ora?",
          "Sì, con gusto. A che ora?",
          "D'accordo. Che ora?"
        ],
        "correct": 0,
        "explanation": "'Si, volentieri' expresa aceptacion amable: 'si, con gusto'.",
        "successLine": "Alle cinque? Davanti alla fontana in piazza!",
        "failureLine": "Forse un'altra volta allora... ciao!"
      },
      {
        "prompt": "Sei uno studente anche tu?",
        "hint": "Pregunta si eres estudiante tambien.",
        "choices": [
          "Sì, studio italiano.",
          "Sì, sto studiando la lingua.",
          "Sì, imparo l'italiano."
        ],
        "correct": 0,
        "explanation": "Ambas opciones son validas, pero 'studio italiano' es la mas natural.",
        "successLine": "Che bello! Parli già molto bene!",
        "failureLine": "Ah, pensavo fossi di Milano... che strano!"
      }
    ],
    "success": "Nico segna l'ora e guadagni un amico in città.",
    "failure": "Nico resta confuso e cambia argomento rapidamente.",
    "reward": {
      "name": "Bunuelo",
      "points": 35,
      "color": "#c9964b"
    },
    "failEvent": "awkward",
    "progression": [
      {
        "greeting": {
          "it": "Ciao! Ti va di fare una passeggiata nel parco?",
          "es": "¡Hola! ¿Te apetece dar un paseo por el parque?"
        },
        "dialogue": [
          {
            "prompt": "Che ne dici di vederci più tardi per una passeggiata?",
            "hint": "Te propone verse más tarde. Di que te gustaría pero hoy estás ocupado.",
            "choices": [
              "Mi piacerebbe, ma oggi sono un po' impegnato.",
              "Mi piacerebbe, ma oggi sto un po' impegnato.",
              "Mi piace, ma oggi sono impegnato."
            ],
            "correct": 0,
            "explanation": "Para responder a una propuesta se usa el condicional 'mi piacerebbe'; y 'essere impegnato' (sono), no 'stare'.",
            "successLine": "Nessun problema! Allora facciamo domani?",
            "failureLine": "Ah, va bene, non fa niente."
          },
          {
            "prompt": "Facciamo domani pomeriggio, allora?",
            "hint": "Propone mañana por la tarde. Acepta y pregunta a qué hora quedan.",
            "choices": [
              "D'accordo! Ci vediamo alle quattro?",
              "D'accordo! Ci vediamo a le quattro?",
              "D'accordo! Ci vediamo alle ore quattro?"
            ],
            "correct": 0,
            "explanation": "'Alle quattro' (a + le). Entre amigos no se dice 'alle ore quattro'.",
            "successLine": "Perfetto, a domani allora!",
            "failureLine": "A che ora dicevi? Non ho capito."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Ormai ci si vede spesso qui al parco. Ti alleni oggi?",
          "es": "¡Hola! Ya nos vemos a menudo aquí en el parque. ¿Te entrenas hoy?"
        },
        "dialogue": [
          {
            "prompt": "Che sport pratichi di solito nel tempo libero?",
            "hint": "Te pregunta qué deporte practicas.",
            "choices": [
              "Mi piace fare jogging la mattina presto.",
              "Mi piace correre il parco la mattina.",
              "Faccio jogging, per piacere."
            ],
            "correct": 0,
            "explanation": "'Fare jogging' es la locución deportiva común en italiano.",
            "successLine": "Davvero? Domani c'è una corsa collettiva. Ti unisci a noi?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Domani c'è una corsa collettiva. Ti unisci a noi?",
            "hint": "Te invita a unirte a una carrera colectiva mañana.",
            "choices": [
              "Mi piacerebbe molto! A che ora vi incontrate?",
              "Mi piacerebbe! A che ora si incontrano?",
              "Sì, vengo con piacere. A che ora partono?"
            ],
            "correct": 0,
            "explanation": "El condicional 'mi piacerebbe' expresa deseo de unirse, y 'vi incontrate' es correcto para referirse al grupo.",
            "successLine": "Ci vediamo alle otto in piazza. A domani!",
            "failureLine": "Un vero peccato."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! C'è un festival del cinema all'aperto qui stasera. Ne sapevi qualcosa?",
          "es": "¡Hola! Hay un festival de cine al aire libre aquí esta noche. ¿Sabías algo al respecto?"
        },
        "dialogue": [
          {
            "prompt": "Fanno vedere una commedia classica italiana alle nove. Vieni?",
            "hint": "Te cuenta sobre la película clásica y pregunta si vas.",
            "choices": [
              "Che bella iniziativa! Pensi che ci sarà molta gente?",
              "Che bella idea! Pensi che sarà molta gente?",
              "Bello! Ci sarà molta folla?"
            ],
            "correct": 0,
            "explanation": "'Che bella iniziativa!' es una expresión idiomática correcta. 'Ci sarà' expresa existencia futura.",
            "successLine": "Sì, conviene andare un po' prima. Ti riservo un posto?",
            "failureLine": "Forse no."
          },
          {
            "prompt": "Sì, conviene andare un po' prima. Ti riservo un posto?",
            "hint": "Te aconseja ir antes y ofrece apartar un asiento.",
            "choices": [
              "Sì, grazie! Te ne sarei davvero grato.",
              "Sì, per favore! Ti ringrazio molto.",
              "Sì, d'accordo. Grazie per il posto."
            ],
            "correct": 0,
            "explanation": "'Te ne sarei davvero grato' es la fórmula condicional formal de agradecimiento.",
            "successLine": "Perfetto, allora ci vediamo più tardi. Ciao!",
            "failureLine": "Va bene."
          }
        ]
      }
    ]
  },
  {
    "id": "festa",
    "level": "B1",
    "place": "Festa in piazza",
    "npc": "Organizzatrice Alba",
    "pos": {
      "x": 5.6,
      "z": 24.1
    },
    "color": "#c95e5e",
    "cefr": "B1",
    "skill": "interaction",
    "canDo": "Ayudar a organizar un evento social",
    "grammar": [
      "preposizioni articolate accanto al/vicino alla",
      "imperativo informale"
    ],
    "vocabTargets": [
      "aiutare",
      "bevande",
      "fontana",
      "vicino",
      "palco"
    ],
    "communicativeFunction": "organizing",
    "errorTypes": [
      "preposition",
      "gender"
    ],
    "prerequisites": [
      "ristorante"
    ],
    "greeting": {
      "it": "Ciao! La festa è appena iniziata. C'è molta musica e allegria. Ti unisci?",
      "es": "¡Hola! La fiesta acaba de empezar. Hay mucha música y alegría. ¿Te unes?"
    },
    "vocab": [
      {
        "it": "Aiutare",
        "es": "Ayudar"
      },
      {
        "it": "Bevande",
        "es": "Bebidas"
      },
      {
        "it": "Fontana",
        "es": "Fuente"
      },
      {
        "it": "Vicino",
        "es": "Cerca"
      },
      {
        "it": "Tavolo",
        "es": "Mesa"
      }
    ],
    "dialogue": [
      {
        "prompt": "Puoi aiutarmi a trovare il tavolo delle bevande?",
        "hint": "Alba pide ayuda para encontrar la mesa de bebidas.",
        "choices": [
          "Certo! È vicino alla fontana.",
          "Certo! È vicino al fontana.",
          "Certo! Sta vicino la fontana."
        ],
        "correct": 0,
        "explanation": "'Certo' = 'claro'. 'È vicino alla fontana' usa la preposicion articulada 'alla'.",
        "successLine": "Ah, non l'avevo visto! Grazie mille!",
        "failureLine": "Non è lì... forse hai visto male?"
      },
      {
        "prompt": "Hai visto anche il tavolo dei dolci?",
        "hint": "Pregunta si viste la mesa de postres.",
        "choices": [
          "Sì, è accanto al palco.",
          "Sì, è al lato del palco.",
          "Sì, sta vicino il palco."
        ],
        "correct": 0,
        "explanation": "'Accanto al palco' = 'junto al escenario'. 'Accanto a' + 'il' se contrae a 'al'.",
        "successLine": "Perfetto! Sei un angelo, grazie!",
        "failureLine": "Dovrei controllare meglio... ma grazie lo stesso!"
      }
    ],
    "success": "Aiuti Alba e tutti festeggiano il tuo italiano.",
    "failure": "Il tavolo finisce sul palco e la festa si ferma un momento.",
    "reward": {
      "name": "Tronco azul",
      "points": 60,
      "color": "#4d8bd6"
    },
    "failEvent": "awkward",
    "progression": [
      {
        "greeting": {
          "it": "Ciao! Mi aiuteresti con l'organizzazione prima che arrivino tutti?",
          "es": "¡Hola! ¿Me ayudarías con la organización antes de que lleguen todos?"
        },
        "dialogue": [
          {
            "prompt": "Mi daresti una mano a spostare queste sedie vicino al palco?",
            "hint": "Alba pide ayuda con las sillas. Di que las pones junto al escenario.",
            "choices": [
              "Certo! Le metto accanto al palco.",
              "Certo! Le metto accanto alla palco.",
              "Certo! Le metto vicino il palco."
            ],
            "correct": 0,
            "explanation": "'Accanto al palco' (a + il). 'Palco' es masculino, y 'vicino/accanto' rigen 'a'.",
            "successLine": "Grazie mille! Sei di grande aiuto.",
            "failureLine": "Attento, non lì... un po' più in là."
          },
          {
            "prompt": "Puoi portare le bevande fresche dal frigo?",
            "hint": "Te pide llevar las bebidas. Di que las llevas a la mesa.",
            "choices": [
              "Sì, le porto subito al tavolo.",
              "Sì, li porto subito al tavolo.",
              "Sì, le porto subito nel tavolo."
            ],
            "correct": 0,
            "explanation": "'Le bevande' es femenino plural → pronombre 'le'. Y 'al tavolo' (a + il).",
            "successLine": "Perfetto! La festa può cominciare!",
            "failureLine": "Occhio, non farle cadere!"
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Grazie ancora per l'aiuto di prima. Ora godiamoci la festa!",
          "es": "¡Hola! Gracias de nuevo por la ayuda de antes. ¡Ahora disfrutemos de la fiesta!"
        },
        "dialogue": [
          {
            "prompt": "Ti va qualcosa da bere? C'è del chinotto fresco.",
            "hint": "Te ofrece beber un refresco italiano llamado chinotto.",
            "choices": [
              "Sì, grazie. Lo assaggio volentieri.",
              "Sì, grazie. Lo provo volentieri.",
              "Sì, voglio assaggiarlo."
            ],
            "correct": 0,
            "explanation": "'Lo assaggio volentieri' es la forma natural de aceptar una comida/bebida nueva para probarla.",
            "successLine": "Ottimo! Ti presento anche Luca. Anche lui studia lingue.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Ti presento Luca. Anche lui studia lingue.",
            "hint": "Te presenta a su amigo Luca.",
            "choices": [
              "Piacere di conoscerti, Luca.",
              "Piacere di conoscerla, Luca.",
              "Molto piacere, Luca."
            ],
            "correct": 0,
            "explanation": "Al tratarse de una fiesta juvenil informal, usamos el registro informal 'conoscerti'.",
            "successLine": "Piacere mio! Di dove sei?",
            "failureLine": "Come?"
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! La band sta per suonare. Sei pronto a ballare in piazza?",
          "es": "¡Hola! La banda está a punto de tocar. ¿Estás listo para bailar en la plaza?"
        },
        "dialogue": [
          {
            "prompt": "Cononsci questa canzone tradizionale pugliese?",
            "hint": "Te pregunta si conoces la canción de fondo y tú valoras el ritmo.",
            "choices": [
              "No, ma ha un ritmo travolgente.",
              "No, ma ha una musica molto forte.",
              "No, ma mi piace molto il suono."
            ],
            "correct": 0,
            "explanation": "'Ritmo travolgente' es una expresión típica italiana para ritmos apasionados y contagiosos.",
            "successLine": "Sì, si chiama pizzica! Vuoi che ti mostri i passi base?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Sì, si chiama pizzica! Vuoi che ti mostri i passi base?",
            "hint": "Te ofrece enseñarte los pasos de baile básicos.",
            "choices": [
              "Sì, proviamoci! Sembra divertente.",
              "Sì, mostrami! Voglio ballare.",
              "Sì, va bene. Fammi vedere."
            ],
            "correct": 0,
            "explanation": "'Proviamoci' (intentémoslo) es la exhortación reflexiva y amigable adecuada.",
            "successLine": "Bravissimo! Segui il tempo del tamburello. Via!",
            "failureLine": "Come?"
          }
        ]
      }
    ]
  },
  {
    "id": "hotel",
    "level": "A1",
    "place": "Hotel",
    "npc": "Receptionist Anna",
    "pos": {
      "x": 19.5,
      "z": -2.5
    },
    "color": "#5e7fa8",
    "cefr": "A1",
    "skill": "interaction",
    "canDo": "Hacer check-in en un hotel",
    "grammar": [
      "avere + sustantivo",
      "numeri cardinali"
    ],
    "vocabTargets": [
      "prenotazione",
      "camera",
      "chiave",
      "piano",
      "soggiorno"
    ],
    "communicativeFunction": "checking-in",
    "errorTypes": [
      "plural",
      "interference"
    ],
    "prerequisites": [],
    "greeting": {
      "it": "Buongiorno e benvenuto all'Hotel Milano. Come posso aiutarla oggi?",
      "es": "¡Buenos días y bienvenido al Hotel Milano. ¿Cómo puedo ayudarle hoy?"
    },
    "vocab": [
      {
        "it": "Prenotazione",
        "es": "Reserva"
      },
      {
        "it": "Camera",
        "es": "Habitacion"
      },
      {
        "it": "Chiave",
        "es": "Llave"
      },
      {
        "it": "Piano",
        "es": "Piso"
      },
      {
        "it": "Soggiorno",
        "es": "Estancia"
      }
    ],
    "dialogue": [
      {
        "prompt": "Buonasera! Ha una prenotazione?",
        "hint": "La recepcionista pregunta si tienes reserva.",
        "choices": [
          "Sì, a nome di {name}.",
          "Sì, in nome di {name}.",
          "Sì, nel nome di {name}."
        ],
        "correct": 0,
        "explanation": "'A nome di' es la preposicion correcta para 'a nombre de'.",
        "successLine": "Eccola! Camera singola al terzo piano.",
        "failureLine": "Non trovo la sua prenotazione nel sistema."
      },
      {
        "prompt": "Quante notti si ferma?",
        "hint": "Pregunta cuantas noches te quedas.",
        "choices": [
          "Tre notti, per favore.",
          "Tre nottes, per favore.",
          "Tre notte, per favore."
        ],
        "correct": 0,
        "explanation": "'Tre notti' (plural de 'notte') es correcto. 'Nottes' no existe.",
        "successLine": "Ecco la chiave. La colazione è dalle 7 alle 10.",
        "failureLine": "Per quel periodo abbiamo solo suite disponibili."
      },
      {
        "prompt": "Ha bisogno di aiuto con i bagagli?",
        "hint": "Ofrece ayuda con el equipaje.",
        "choices": [
          "No, grazie. Ho solo questa borsa.",
          "No, grazie. Ho solo questo borsa.",
          "Grazie, ma faccio da solo."
        ],
        "correct": 0,
        "explanation": "'Ho solo questa borsa' = 'solo tengo esta bolsa'. Natural y educado.",
        "successLine": "Buon soggiorno allora! Se ha bisogno, chiami pure.",
        "failureLine": "Il facchino arriva subito... ah, ha cambiato idea?"
      }
    ],
    "success": "Anna ti consegna la chiave della tua camera. Ottimo soggiorno!",
    "failure": "La prenotazione si perde e devi cercare un altro posto.",
    "reward": {
      "name": "Tiramisu",
      "points": 15,
      "color": "#8c6239"
    },
    "failEvent": "awkward",
    "progression": [
      {
        "greeting": {
          "it": "Buonasera. Check-in per stasera? A che nome?",
          "es": "¡Buenas noches! ¿Check-in para esta noche? ¿A qué nombre?"
        },
        "dialogue": [
          {
            "prompt": "Buonasera. Ha un documento per la registrazione?",
            "hint": "Pide un documento. Ofrece tu pasaporte.",
            "choices": [
              "Sì, ecco il mio passaporto.",
              "Sì, ecco il mio passaporte.",
              "Sì, ecco mio passaporto."
            ],
            "correct": 0,
            "explanation": "'Il mio passaporto' — el posesivo lleva artículo, y 'passaporto' termina en -o.",
            "successLine": "Grazie. Camera doppia al secondo piano.",
            "failureLine": "Mi serve un documento valido, per favore."
          },
          {
            "prompt": "Ecco le chiavi. La colazione è al piano terra dalle sette.",
            "hint": "Te da las llaves e informa del desayuno. Pregunta a qué hora cierra.",
            "choices": [
              "Grazie. A che ora chiude la colazione?",
              "Grazie. A che ora chiude il colazione?",
              "Grazie. Quando chiude a la colazione?"
            ],
            "correct": 0,
            "explanation": "'La colazione' es femenino; se pregunta 'a che ora chiude'.",
            "successLine": "Fino alle dieci. Buon soggiorno!",
            "failureLine": "Scusi, non ho capito."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno. Desidera fare il check-out o ha bisogno di informazioni?",
          "es": "¡Buenos días! ¿Desea hacer el check-out o necesita información?"
        },
        "dialogue": [
          {
            "prompt": "Buongiorno! Vorrebbe fare il check-out della sua stanza?",
            "hint": "Te pregunta si vas a hacer el registro de salida.",
            "choices": [
              "Sì, ecco la chiave della camera centodue.",
              "Sì, ecco la chiave di camera centodue.",
              "Tenga la chiave, camera centodue."
            ],
            "correct": 0,
            "explanation": "'Chiave della camera...' expresa posesión con preposición articulada femenina.",
            "successLine": "Ecco il conto. Ci sono venti euro per il minibar.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Ecco il conto. Ci sono venti euro per il minibar. Come paga?",
            "hint": "Te da la cuenta y tú pagas con tarjeta.",
            "choices": [
              "D'accordo. Posso pagare con carta?",
              "D'accordo. Posso pagare in carta?",
              "D'accordo. Accettate la carta?"
            ],
            "correct": 0,
            "explanation": "El instrumento de pago utiliza la preposición 'con': 'con carta'.",
            "successLine": "Certamente. Transazione eseguita. Arrivederci!",
            "failureLine": "Errore carta."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! La colazione è inclusa nel soggiorno. Desidera sapere dove viene servita?",
          "es": "¡Buenos días! El desayuno está incluido en la estancia. ¿Desea saber dónde se sirve?"
        },
        "dialogue": [
          {
            "prompt": "La colazione viene servita al mattino. Sa dove andare?",
            "hint": "Te pregunta si sabes dónde ir a desayunar y tú pides indicaciones.",
            "choices": [
              "Sì, dove viene servita la colazione?",
              "Sì, dove si mangia il cibo al mattino?",
              "Dove c'è la colazione?"
            ],
            "correct": 0,
            "explanation": "'Dove viene servita...?' es la forma pasiva estándar y elegante en hoteles.",
            "successLine": "Nella sala al piano terra, dalle 7 alle 10.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Nella sala al piano terra, dalle 7 alle 10. Serve altro?",
            "hint": "Te da el horario y ubicación y tú respondes educadamente.",
            "choices": [
              "Grazie, ma preferisco scendere in sala.",
              "Grazie, ma preferisco andare giù.",
              "Grazie, scendo in sala."
            ],
            "correct": 0,
            "explanation": "'Scendere in sala' es la locución verbal correcta para bajar al salón comedor.",
            "successLine": "D'accordo. Buona colazione!",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "gelateria",
    "level": "A1",
    "place": "Gelateria",
    "npc": "Gelataio Mario",
    "pos": {
      "x": -15,
      "z": -7
    },
    "color": "#ffb6c1",
    "cefr": "A1",
    "skill": "interaction",
    "canDo": "Pedir un helado eligiendo sabores",
    "grammar": [
      "articolo indeterminativo un/una",
      "e (congiunzione)"
    ],
    "vocabTargets": [
      "gusti",
      "cono",
      "coppetta",
      "panna",
      "cioccolato",
      "fragola"
    ],
    "communicativeFunction": "ordering",
    "errorTypes": [
      "article",
      "interference"
    ],
    "prerequisites": [],
    "greeting": {
      "it": "Ciao! Gelato artigianale freschissimo. Quali gusti ti preparo?",
      "es": "¡Hola! Helado artesanal fresquísimo. ¿Qué sabores te preparo?"
    },
    "vocab": [
      {
        "it": "Gusti",
        "es": "Sabores"
      },
      {
        "it": "Cono",
        "es": "Cono"
      },
      {
        "it": "Coppetta",
        "es": "Vasito"
      },
      {
        "it": "Panna",
        "es": "Nata"
      },
      {
        "it": "Cioccolato",
        "es": "Chocolate"
      }
    ],
    "dialogue": [
      {
        "prompt": "Cono o coppetta?",
        "hint": "Pregunta si quieres cono o vasito.",
        "choices": [
          "Un cono, per favore.",
          "Un gelato al cono, per piacere.",
          "Cono, per piacere."
        ],
        "correct": 0,
        "explanation": "'Un cono, per favore' es la respuesta mas natural y correcta.",
        "successLine": "Quanti gusti desidera?",
        "failureLine": "Abbiamo finito i coni. Solo coppetta oggi!"
      },
      {
        "prompt": "Quali gusti preferisce?",
        "hint": "Pregunta que sabores prefieres.",
        "choices": [
          "Cioccolato e fragola.",
          "Cioccolata e fragola, per piacere.",
          "Cioccolato con fragola, per piacere."
        ],
        "correct": 0,
        "explanation": "'Cioccolato e fragola' es correcto. 'Fragola' no cambia en este contexto.",
        "successLine": "Ecco qua! Con panna? Costa solo 50 centesimi in più.",
        "failureLine": "La fragola è finita. Provi il pistacchio?"
      },
      {
        "prompt": "Sono tre euro.",
        "hint": "Te dice el precio: 3 euros.",
        "choices": [
          "Ecco a Lei. Grazie!",
          "Ecco per Lei. Grazie!",
          "Ecco. Tenga."
        ],
        "correct": 0,
        "explanation": "'Ecco a Lei' es la forma formal correcta de 'aqui tiene'.",
        "successLine": "Grazie! Buona giornata!",
        "failureLine": "Mi dispiace, non ho resto per quella banconota."
      }
    ],
    "success": "Mario prepara un gelato doppio perfetto. È delizioso!",
    "failure": "Mario confonde i gusti e ti dà qualcosa di immangiabile.",
    "reward": {
      "name": "Gelato Doppio",
      "points": 15,
      "color": "#FFB6C1"
    },
    "failEvent": "badFood",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Cono o coppetta oggi?",
          "es": "¡Buenos días! ¿Cono o vasito hoy?"
        },
        "dialogue": [
          {
            "prompt": "Ciao! Quanti gusti per il tuo cono?",
            "hint": "Pregunta cuántos sabores. Di que dos.",
            "choices": [
              "Due gusti, per favore.",
              "Due gusto, per favore.",
              "Dei due gusti, per favore."
            ],
            "correct": 0,
            "explanation": "'Due gusti' — plural sin partitivo.",
            "successLine": "Quali gusti allora?",
            "failureLine": "Come? Quanti ne vuoi?"
          },
          {
            "prompt": "Quali gusti ti metto?",
            "hint": "Pregunta qué sabores. Pide limón y chocolate.",
            "choices": [
              "Limone e cioccolato, grazie.",
              "Limone y cioccolato, grazie.",
              "Un limone e un cioccolato, grazie."
            ],
            "correct": 0,
            "explanation": "En italiano la conjunción 'y' es 'e'; los gustos no llevan 'un'.",
            "successLine": "Ecco! Vuoi la panna sopra?",
            "failureLine": "Non ho capito i gusti."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Abbiamo dei nuovi gusti di frutta di stagione oggi. Vuoi assaggiarli?",
          "es": "¡Hola! Tenemos nuevos sabores de fruta de temporada hoy. ¿Quieres probarlos?"
        },
        "dialogue": [
          {
            "prompt": "Desidera cono o coppetta media?",
            "hint": "Te pregunta si deseas cono o vasito mediano.",
            "choices": [
              "Una coppetta da tre gusti, per favore.",
              "Un cono da tre gusti, per favore.",
              "Una coppa di tre gusti, per piacere."
            ],
            "correct": 0,
            "explanation": "'Coppetta da tre gusti' utiliza la preposición 'da' para indicar capacidad o precio.",
            "successLine": "Quali tre gusti vuole metterci?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Quali tre gusti vuole metterci?",
            "hint": "Te pide los tres sabores para el vasito.",
            "choices": [
              "Pistacchio, nocciola e stracciatella, grazie.",
              "Pistacchio, nocciola e cioccolato, per piacere.",
              "Limone, fragola e pistacchio."
            ],
            "correct": 0,
            "explanation": "Combinación clásica italiana de tres gustos cremosos.",
            "successLine": "Desidera anche della panna montata sopra?",
            "failureLine": "Gusto finito."
          },
          {
            "prompt": "Desidera anche della panna montata sopra?",
            "hint": "Te pregunta si deseas nata montada arriba.",
            "choices": [
              "Sì, con panna montata, grazie.",
              "No, senza panna, grazie.",
              "Sì, metta panna, per favore."
            ],
            "correct": 0,
            "explanation": "'Con panna montata' es la expresión correcta para nata.",
            "successLine": "Ecco a Lei! Sono quattro euro.",
            "failureLine": "Non capisco."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Giornata caldissima, ci vuole proprio un bel gelato! Che dimensioni desidera?",
          "es": "¡Buenos días! Día calurosísimo, ¡se necesita un buen helado! ¿Qué tamaño desea?"
        },
        "dialogue": [
          {
            "prompt": "Abbiamo cono piccolo, medio e grande. Quale prende?",
            "hint": "Te ofrece los tres tamaños y tú pides uno grande.",
            "choices": [
              "Un cono grande da quattro euro, per favore.",
              "Un cono grande di quattro euro, per favore.",
              "Un cono grande per quattro euro, per piacere."
            ],
            "correct": 0,
            "explanation": "'Cono da quattro euro' describe el tipo de cono según su precio unitario con la preposición 'da'.",
            "successLine": "Bene, e quali gusti ci mettiamo?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Bene, e quali gusti ci mettiamo?",
            "hint": "Te pide los sabores y tú eliges cuatro de frutas refrescantes.",
            "choices": [
              "Limone, mango, melone e pesca, grazie.",
              "Cioccolato, crema, caffè e nocciola.",
              "Fragola, vaniglia, banana e cocco."
            ],
            "correct": 0,
            "explanation": "Sabores a base de fruta ('limone', 'melone', 'pesca') ideales para el calor.",
            "successLine": "Ecco a Lei. Consumazione al tavolo o da asporto?",
            "failureLine": "Gusto non disponibile."
          },
          {
            "prompt": "Ecco a Lei. Consumazione al tavolo o da asporto?",
            "hint": "Te entrega el helado y pregunta si es para comer allí o llevar.",
            "choices": [
              "Da asporto, grazie.",
              "Al tavolo, grazie.",
              "Per portare via, grazie."
            ],
            "correct": 0,
            "explanation": "'Da asporto' es para llevar en tiendas de alimentos en Italia.",
            "successLine": "Grazie mille! Buona passeggiata!",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "taxi",
    "level": "A2",
    "place": "Taxi",
    "npc": "Tassista Bruno",
    "pos": {
      "x": 26,
      "z": -8
    },
    "color": "#f5d76e",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Tomar un taxi y dar direcciones basicas",
    "grammar": [
      "preposizioni di luogo in/a",
      "imperativo formale vada/giri"
    ],
    "vocabTargets": [
      "indirizzo",
      "destinazione",
      "girare",
      "fermarsi",
      "resto"
    ],
    "communicativeFunction": "asking-directions",
    "errorTypes": [
      "preposition",
      "register"
    ],
    "prerequisites": [
      "caffe",
      "hotel"
    ],
    "greeting": {
      "it": "Salve! Taxi libero. Dove desidera andare?",
      "es": "¡Hola! Taxi libre. ¿A dónde desea ir?"
    },
    "vocab": [
      {
        "it": "Indirizzo",
        "es": "Direccion"
      },
      {
        "it": "Destinazione",
        "es": "Destino"
      },
      {
        "it": "Quanto costa?",
        "es": "Cuanto cuesta?"
      },
      {
        "it": "Girare",
        "es": "Girar"
      },
      {
        "it": "Fermarsi",
        "es": "Parar"
      }
    ],
    "dialogue": [
      {
        "prompt": "Dove la porto?",
        "hint": "El taxista pregunta a donde te lleva.",
        "choices": [
          "In centro, per favore.",
          "Al centro, per favore.",
          "Nel centro, per piacere."
        ],
        "correct": 0,
        "explanation": "'In centro' usa la preposicion correcta para destinos de zona generica.",
        "successLine": "D'accordo! Per la strada veloce?",
        "failureLine": "Non conosco quella via. Ha l'indirizzo esatto?"
      },
      {
        "prompt": "Preferisce la strada panoramica? Ci mette più tempo.",
        "hint": "Ofrece ruta panoramica pero avisa que tarda mas.",
        "choices": [
          "No, vada diretto, grazie.",
          "No, va diretto, grazie.",
          "Meglio la strada veloce."
        ],
        "correct": 0,
        "explanation": "'Vada diretto' usa el subjuntivo formal (Lei) correctamente.",
        "successLine": "Va bene! Arriveremo in dieci minuti.",
        "failureLine": "C'è traffico sulla strada veloce oggi."
      },
      {
        "prompt": "Ecco, siamo arrivati. Sono quindici euro.",
        "hint": "Llegaron. Son 15 euros.",
        "choices": [
          "Ecco venti. Tenga il resto.",
          "Ecco venti. Tenga il cambio.",
          "Tenga. Arrivederci."
        ],
        "correct": 0,
        "explanation": "'Tenga il resto' = 'quedese con el cambio'. Uso correcto del imperativo formal.",
        "successLine": "Grazie! Buona permanenza in città!",
        "failureLine": "Mi dispiace, il POS non funziona oggi. Solo contanti."
      }
    ],
    "success": "Bruno ti porta per una strada bellissima. Arrivi in tempo.",
    "failure": "Bruno prende una scorciatoia sbagliata e finite in un vicolo.",
    "reward": {
      "name": "Arancino",
      "points": 25,
      "color": "#D4841A"
    },
    "failEvent": "wrongPlatform",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Dove devo portarla oggi?",
          "es": "¡Buenos días! ¿A dónde debo llevarla hoy?"
        },
        "dialogue": [
          {
            "prompt": "Salve! Qual è la destinazione?",
            "hint": "Pregunta el destino. Di a la estación central.",
            "choices": [
              "Alla stazione centrale, per favore.",
              "A la stazione centrale, per favore.",
              "In stazione centrale, per favore."
            ],
            "correct": 0,
            "explanation": "'Alla stazione' (a + la): con un lugar específico se usa la preposición articulada.",
            "successLine": "Va bene. C'è un po' di traffico, ma ci proviamo.",
            "failureLine": "Dove, scusi? Mi ripeta l'indirizzo."
          },
          {
            "prompt": "Siamo quasi arrivati. Dove la lascio?",
            "hint": "Pregunta dónde parar. Pídele que pare en la esquina (trato formal).",
            "choices": [
              "Si fermi qui all'angolo, grazie.",
              "Ferma qui all'angolo, grazie.",
              "Si ferma qui all'angolo, grazie."
            ],
            "correct": 0,
            "explanation": "'Si fermi' es el imperativo formal (Lei); 'ferma' es informal y 'si ferma' es indicativo.",
            "successLine": "Ecco. Sono otto euro. Tenga pure il resto.",
            "failureLine": "Non posso fermarmi qui, c'è divieto."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Destinazione Stazione Centrale? C'è un po' di traffico oggi.",
          "es": "¡Hola! ¿Destino Estación Central? Hay un poco de tráfico hoy."
        },
        "dialogue": [
          {
            "prompt": "Andiamo per la circonvallazione per fare prima?",
            "hint": "Te ofrece ir por la circunvalación para llegar antes.",
            "choices": [
              "Sì, vada pure per di là.",
              "Sì, va pure per là.",
              "Sì, vada diretto, grazie."
            ],
            "correct": 0,
            "explanation": "'Vada pure' es el subjuntivo formal con valor imperativo permisivo (vaya no más).",
            "successLine": "D'accordo. Eviteremo l'ingorgo in centro.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Mi può indicare dove fermarmi esattamente?",
            "hint": "Te pide que indiques el lugar exacto para parar.",
            "choices": [
              "Si fermi dopo il semaforo, grazie.",
              "Si ferma dopo il semaforo, grazie.",
              "Fermati dopo il semaforo, per favore."
            ],
            "correct": 0,
            "explanation": "'Si fermi' es el subjuntivo de cortesía formal (pare en el semáforo).",
            "successLine": "Perfetto. Sono dodici euro.",
            "failureLine": "Non posso fermarmi qui."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Ha molti bagagli da mettere nel portabagagli?",
          "es": "¡Buenos días! ¿Tiene mucho equipaje que poner en el maletero?"
        },
        "dialogue": [
          {
            "prompt": "Ho solo questa valigia grande e uno zaino.",
            "hint": "Dile qué equipaje llevas.",
            "choices": [
              "Li metto io nel bagagliaio, non si preoccupi.",
              "Li metto io nel portabagagli, non si preoccupi.",
              "Li metto io dietro, non ti preoccupare."
            ],
            "correct": 0,
            "explanation": "'Nel bagagliaio' es la forma habitual. 'Non si preoccupi' es la cortesía formal (no se preocupe).",
            "successLine": "Molto gentile. Salga pure a bordo.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Siamo arrivati. La tariffa è di diciotto euro.",
            "hint": "Llegaste y te indica el precio. Pregunta si acepta pago con tarjeta.",
            "choices": [
              "Accetta pagamenti con carta di credito?",
              "Accetta pagamenti in carta di credito?",
              "Si può pagare con bancomat?"
            ],
            "correct": 0,
            "explanation": "'Con carta' es la preposición de instrumento correcta en italiano.",
            "successLine": "Certamente, ecco la ricevuta. Buona giornata!",
            "failureLine": "Solo contanti."
          }
        ]
      }
    ]
  },
  {
    "id": "museo",
    "level": "A2",
    "place": "Museo",
    "npc": "Bigliettaia Carla",
    "pos": {
      "x": 22.5,
      "z": 14
    },
    "color": "#8d9b6a",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Comprar entradas y preguntar por descuentos",
    "grammar": [
      "aggettivi dimostrativi questo/quello",
      "preposizioni di prezzo"
    ],
    "vocabTargets": [
      "biglietto",
      "sconto",
      "studente",
      "mostra",
      "temporanea"
    ],
    "communicativeFunction": "shopping",
    "errorTypes": [
      "gender",
      "interference"
    ],
    "prerequisites": [
      "panetteria",
      "gelateria"
    ],
    "greeting": {
      "it": "Buongiorno. Benvenuto al Museo Civico. Biglietteria.",
      "es": "¡Buenos días! Bienvenido al Museo Cívico. Taquilla."
    },
    "vocab": [
      {
        "it": "Biglietto",
        "es": "Entrada"
      },
      {
        "it": "Sconto",
        "es": "Descuento"
      },
      {
        "it": "Studente",
        "es": "Estudiante"
      },
      {
        "it": "Mostra",
        "es": "Exposicion"
      },
      {
        "it": "Orario",
        "es": "Horario"
      }
    ],
    "dialogue": [
      {
        "prompt": "Intero o ridotto?",
        "hint": "Pregunta si entrada normal o reducida.",
        "choices": [
          "Ridotto, sono studente.",
          "Ridotta, sono studente.",
          "Ridotto, perché sono un studente."
        ],
        "correct": 0,
        "explanation": "'Ridotto' es 'reducido' en italiano. 'Sono studente' = 'soy estudiante'.",
        "successLine": "Mi mostri un documento, per favore.",
        "failureLine": "Il ridotto è solo per under 26 con tesserino."
      },
      {
        "prompt": "Le interessa anche la mostra temporanea?",
        "hint": "Ofrece entrada a exposicion temporal.",
        "choices": [
          "Sì, quanto costa in più?",
          "Sì, quanto costano in più?",
          "Sì. Qual è il prezzo aggiuntivo?"
        ],
        "correct": 0,
        "explanation": "'Quanto costa in più?' es la forma mas directa y natural.",
        "successLine": "Solo quattro euro. Ne vale la pena!",
        "failureLine": "Purtroppo chiude tra mezz'ora. Meglio tornare domani."
      }
    ],
    "success": "Carla ti dà una mappa del museo segnando le sale migliori.",
    "failure": "Ti danno il biglietto sbagliato e entri a un matrimonio privato.",
    "reward": {
      "name": "Cannolo",
      "points": 20,
      "color": "#C9964B"
    },
    "failEvent": "awkward",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Desidera visitare la collezione permanente oggi?",
          "es": "¡Buenos días! ¿Desea visitar la colección permanente hoy?"
        },
        "dialogue": [
          {
            "prompt": "Un biglietto intero? Sono dodici euro.",
            "hint": "Menciona el precio entero. Pregunta si hay descuento para estudiantes.",
            "choices": [
              "C'è uno sconto per studenti?",
              "C'è un sconto per studenti?",
              "C'è uno sconto di studenti?"
            ],
            "correct": 0,
            "explanation": "'Uno sconto' (ante s + consonante) y 'per studenti' (finalidad).",
            "successLine": "Sì, con il tesserino il ridotto è otto euro.",
            "failureLine": "Mi mostri un documento, prego."
          },
          {
            "prompt": "Quella mostra temporanea le interessa?",
            "hint": "Te ofrece la exposición temporal. Pregunta cuánto cuesta esa entrada.",
            "choices": [
              "Sì, quanto costa quel biglietto?",
              "Sì, quanto costa quello biglietto?",
              "Sì, quanto costa questa biglietto?"
            ],
            "correct": 0,
            "explanation": "'Quel biglietto' — 'quello' se apocopa a 'quel' ante consonante; 'biglietto' es masculino.",
            "successLine": "Cinque euro in più. Le faccio il combinato?",
            "failureLine": "La mostra chiude presto, si sbrighi."
          }
        ]
      },
      {
        "greeting": {
          "it": "Salve. Ci sono sconti per comitive o famiglie oggi. Siete in quanti?",
          "es": "¡Hola! Hay descuentos para grupos o familias hoy. ¿Son cuántos?"
        },
        "dialogue": [
          {
            "prompt": "Siamo tre adulti e due bambini. Quale opzione conviene?",
            "hint": "Pregunta si hay tarifa de grupo/familia.",
            "choices": [
              "C'è un biglietto famiglia cumulativo?",
              "C'è un biglietto famiglia combinato?",
              "C'è un biglietto per la famiglia?"
            ],
            "correct": 0,
            "explanation": "'Biglietto famiglia' es la locución correcta para entradas familiares.",
            "successLine": "Sì, costa trenta euro ed è valido per tutto il giorno.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Sì, costa trenta euro ed è valido per tutto il giorno. Lo volete?",
            "hint": "Te ofrece el boleto de 30 euros y tú aceptas.",
            "choices": [
              "Sì, lo prendiamo, grazie.",
              "Sì, li prendiamo, grazie.",
              "Bene! Voglio questo, grazie."
            ],
            "correct": 0,
            "explanation": "Usamos el pronombre directo masculino singular 'lo' para referirnos al billete.",
            "successLine": "Ecco a voi. Buona visita al museo!",
            "failureLine": "Errore pagamento."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! La galleria fotografica chiude tra un'ora. Desidera iniziare da lì?",
          "es": "¡Buenos días! La galería fotográfica cierra en una hora. ¿Desea empezar por ahí?"
        },
        "dialogue": [
          {
            "prompt": "La galleria chiude a breve. Ci va?",
            "hint": "Te pregunta si vas a ir allá. Pregunta si se permiten fotos.",
            "choices": [
              "Sì, è consentito fare foto all'interno?",
              "Sì, è permesso di fare foto?",
              "Si può fotografare con flash?"
            ],
            "correct": 0,
            "explanation": "'È consentito fare...?' es la fórmula formal correcta.",
            "successLine": "Sì, ma senza flash, per favore.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Sì, ma senza flash, per favore. Desidera anche un'audioguida?",
            "hint": "Te confirma la regla del flash y ofrece una audioguía.",
            "choices": [
              "Sì, vorrei noleggiare un'audioguida.",
              "Sì, vorrei affittare un'audioguida.",
              "Sì, voglio un'audioguida."
            ],
            "correct": 0,
            "explanation": "El verbo 'noleggiare' es el adecuado para rentar dispositivos tecnológicos o coches.",
            "successLine": "Certamente. Sono quattro euro per il noleggio.",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "supermercato",
    "level": "A1",
    "place": "Supermercato",
    "npc": "Cassiere Davide",
    "pos": {
      "x": -25,
      "z": -8
    },
    "color": "#c7a55a",
    "cefr": "A1",
    "skill": "interaction",
    "canDo": "Pagar en la caja del supermercado",
    "grammar": [
      "ce l'ho (possesso idiomatico)",
      "negazione non...nessuno"
    ],
    "vocabTargets": [
      "sacchetto",
      "scontrino",
      "contanti",
      "bancomat",
      "tessera"
    ],
    "communicativeFunction": "shopping",
    "errorTypes": [
      "idiom",
      "interference"
    ],
    "prerequisites": [],
    "greeting": {
      "it": "Buongiorno! Benvenuto al Supermercato Express. Cassa numero tre.",
      "es": "¡Buenos días! Bienvenido al Supermercado Express. Caja número tres."
    },
    "vocab": [
      {
        "it": "Sacchetto",
        "es": "Bolsa"
      },
      {
        "it": "Scontrino",
        "es": "Ticket"
      },
      {
        "it": "Contanti",
        "es": "Efectivo"
      },
      {
        "it": "Bancomat",
        "es": "Tarjeta"
      },
      {
        "it": "Resto",
        "es": "Cambio"
      }
    ],
    "dialogue": [
      {
        "prompt": "Vuole un sacchetto?",
        "hint": "Pregunta si quieres una bolsa.",
        "choices": [
          "Sì, grazie.",
          "Sì, per favore.",
          "D'accordo."
        ],
        "correct": 0,
        "explanation": "'Si, grazie' es la respuesta mas simple y correcta.",
        "successLine": "Sono dieci centesimi. Paga in contanti o con bancomat?",
        "failureLine": "Non ho sacchetti grandi. Le va bene uno piccolo?"
      },
      {
        "prompt": "Ha la tessera fedeltà?",
        "hint": "Pregunta si tienes tarjeta de fidelidad.",
        "choices": [
          "No, non ce l'ho.",
          "No, non la tengo.",
          "No, non ho."
        ],
        "correct": 0,
        "explanation": "'Non ce l'ho' = 'no la tengo'. 'Ce l'ho' es la forma idiomatica obligatoria.",
        "successLine": "Va bene. Sono ventidue euro in totale.",
        "failureLine": "Allora non posso applicare lo sconto di oggi."
      }
    ],
    "success": "Davide ti dà lo scontrino e un sorriso. Tutto in ordine.",
    "failure": "La borsa si rompe e tutto rotola per terra.",
    "reward": {
      "name": "Focaccia",
      "points": 10,
      "color": "#C7A55A"
    },
    "failEvent": "badFood",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno. Ha trovato tutto quello che cercava?",
          "es": "¡Buenos días! ¿Ha encontrado todo lo que buscaba?"
        },
        "dialogue": [
          {
            "prompt": "Ha la tessera del supermercato?",
            "hint": "Pregunta si tienes la tarjeta. Di que no la tienes.",
            "choices": [
              "No, non ce l'ho, mi dispiace.",
              "No, non l'ho, mi dispiace.",
              "No, no ce l'ho, mi dispiace."
            ],
            "correct": 0,
            "explanation": "'Non ce l'ho' es la forma idiomática obligatoria para 'no la tengo'.",
            "successLine": "Va bene. Vuole un sacchetto?",
            "failureLine": "Senza tessera niente punti, mi spiace."
          },
          {
            "prompt": "Paga in contanti?",
            "hint": "Pregunta si pagas en efectivo. Di que no tienes y ofrece pagar con tarjeta.",
            "choices": [
              "No, non ho contanti. Posso con il bancomat?",
              "No, non tengo contanti. Posso con il bancomat?",
              "No, nessun contante. Posso con il bancomat?"
            ],
            "correct": 0,
            "explanation": "Se dice 'non ho contanti' (avere). 'Tenere' es un calco del español.",
            "successLine": "Nessun problema. Inserisca la carta.",
            "failureLine": "Solo contanti a questa cassa, mi dispiace."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Paga in contanti o con la carta oggi alla cassa?",
          "es": "¡Hola! ¿Paga en efectivo o con tarjeta hoy en la caja?"
        },
        "dialogue": [
          {
            "prompt": "Paga con bancomat o contanti?",
            "hint": "Pregunta si pagas con tarjeta de débito o en efectivo.",
            "choices": [
              "Con bancomat, grazie.",
              "Con bancomat, per favore.",
              "In bancomat, per piacere."
            ],
            "correct": 0,
            "explanation": "En Italia se usa 'bancomat' para tarjeta de débito, precedido de 'con'.",
            "successLine": "Inserisca la carta e digiti il PIN sul tastierino.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Inserisca la carta e digiti il PIN sul tastierino.",
            "hint": "Te pide insertar la tarjeta e introducir el código.",
            "choices": [
              "Fatto! Devo firmare lo scontrino?",
              "Fatto! Devo firmare il foglio?",
              "Sì, ho inserito."
            ],
            "correct": 0,
            "explanation": "'Firmare lo scontrino' es la acción de firmar el comprobante de pago.",
            "successLine": "No, non serve. Ecco a Lei! Arrivederci!",
            "failureLine": "Codice errato."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Raccoglie i bollini per la promozione dei piatti?",
          "es": "¡Buenos días! ¿Colecciona los sellos para la promoción de los platos?"
        },
        "dialogue": [
          {
            "prompt": "Raccoglie i bollini della promozione?",
            "hint": "Pregunta si juntas los sellos de la promoción y tú rechazas educadamente.",
            "choices": [
              "No, non li colleziono. Grazie lo stesso.",
              "No, non mi interessano. Grazie lo stesso.",
              "No, non li voglio."
            ],
            "correct": 0,
            "explanation": "'Non li colleziono' usa el pronombre directo 'li' (los) de forma correcta.",
            "successLine": "Va bene. Ecco lo scontrino.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Ecco lo scontrino. Buona giornata!",
            "hint": "Te da el recibo y te desea un buen día.",
            "choices": [
              "Grazie a Lei, arrivederci!",
              "Grazie a te, arrivederci!",
              "Grazie, buona giornata!"
            ],
            "correct": 0,
            "explanation": "'Grazie a Lei' es la cortesía formal para responder a un trabajador de comercio.",
            "successLine": "Arrivederci! Buona giornata!",
            "failureLine": "Prego?"
          }
        ]
      }
    ]
  },
  {
    "id": "banca",
    "level": "B1",
    "place": "Banca",
    "npc": "Impiegato Franco",
    "pos": {
      "x": -28,
      "z": 18
    },
    "color": "#6b7b3a",
    "cefr": "B1",
    "skill": "interaction",
    "canDo": "Realizar transacciones bancarias basicas",
    "grammar": [
      "condizionale vorrei per richieste formali",
      "preposizioni articolate"
    ],
    "vocabTargets": [
      "cambiare",
      "conto",
      "sportello",
      "tasso di cambio",
      "commissione"
    ],
    "communicativeFunction": "negotiating",
    "errorTypes": [
      "register",
      "conjugation"
    ],
    "prerequisites": [
      "negozio",
      "farmacia"
    ],
    "greeting": {
      "it": "Buongiorno. Banca Nazionale Italiana. Come posso aiutarla?",
      "es": "¡Buenos días! Banco Nacional Italiano. ¿Cómo puedo ayudarle?"
    },
    "vocab": [
      {
        "it": "Cambiare",
        "es": "Cambiar"
      },
      {
        "it": "Conto",
        "es": "Cuenta"
      },
      {
        "it": "Sportello",
        "es": "Ventanilla"
      },
      {
        "it": "Tasso di cambio",
        "es": "Tipo de cambio"
      },
      {
        "it": "Commissione",
        "es": "Comision"
      }
    ],
    "dialogue": [
      {
        "prompt": "Cosa posso fare per Lei?",
        "hint": "El empleado pregunta en que puede ayudarte.",
        "choices": [
          "Vorrei cambiare dei soldi.",
          "Voglio cambiare soldi.",
          "Devo cambiare i miei soldi."
        ],
        "correct": 0,
        "explanation": "'Cambiare dei soldi' es la expresion correcta: 'cambiar algo de dinero'.",
        "successLine": "Certo! Che valuta ha?",
        "failureLine": "Oggi lo sportello cambio è chiuso. Ripassi domani."
      },
      {
        "prompt": "Vuole il contante o un accredito sul conto?",
        "hint": "Pregunta si quieres efectivo o deposito en cuenta.",
        "choices": [
          "Contante, per favore.",
          "Soldi contanti, per piacere.",
          "In contanti, grazie."
        ],
        "correct": 0,
        "explanation": "'Contante' es la forma abreviada comun de 'denaro contante'.",
        "successLine": "Ecco. Il tasso oggi è favorevole.",
        "failureLine": "C'è una commissione di cinque euro. Procedo lo stesso?"
      }
    ],
    "success": "Franco elabora il cambio rapidamente con un buon tasso.",
    "failure": "Ti applicano una commissione a sorpresa del 20%.",
    "reward": {
      "name": "Panna Cotta",
      "points": 35,
      "color": "#F0E6D0"
    },
    "failEvent": "dizzy",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno, desidera fare un'operazione allo sportello?",
          "es": "¡Buenos días! ¿Desea hacer una operación en ventanilla?"
        },
        "dialogue": [
          {
            "prompt": "Buongiorno. Di cosa ha bisogno oggi?",
            "hint": "Pregunta qué necesitas. Di que quieres abrir una cuenta corriente (cortés).",
            "choices": [
              "Vorrei aprire un conto corrente.",
              "Voglio aprire un conto corrente.",
              "Vorrei aprire un conto di corrente."
            ],
            "correct": 0,
            "explanation": "'Conto corrente' es una locución fija sin 'di'; 'vorrei' mantiene el registro formal.",
            "successLine": "Certo. Ha con sé un documento e il codice fiscale?",
            "failureLine": "Mi scusi, non ho capito la richiesta."
          },
          {
            "prompt": "C'è una piccola commissione sul cambio. Va bene?",
            "hint": "Avisa de una comisión. Acepta y pregunta por el tipo de cambio de hoy.",
            "choices": [
              "Sì, va bene. Qual è il tasso di cambio oggi?",
              "Sì, va bene. Qual è il tasso del cambio oggi?",
              "Sì, va bene. Quanto è il cambio di tasso?"
            ],
            "correct": 0,
            "explanation": "'Tasso di cambio' es la locución fija (tipo de cambio).",
            "successLine": "Oggi è favorevole. Procedo con l'operazione.",
            "failureLine": "Le spiego meglio le condizioni."
          }
        ]
      },
      {
        "greeting": {
          "it": "Salve. Per aprire un conto corrente serve un documento d'identità valido.",
          "es": "¡Hola! Para abrir una cuenta corriente se necesita un documento de identidad válido."
        },
        "dialogue": [
          {
            "prompt": "Ha con sé il codice fiscale?",
            "hint": "Pregunta si traes el código fiscal (código nacional tributario italiano).",
            "choices": [
              "Sì, ce l'ho. Ecco il passaporto.",
              "Sì, eccolo. Ho anche il passaporto.",
              "Sì, lo tengo. Ho anche il passaporto."
            ],
            "correct": 0,
            "explanation": "'Ce l'ho' es la expresión idiomática de posesión. 'Codice fiscale' es indispensable para bancos en Italia.",
            "successLine": "Ottimo. Deve firmare questi moduli per la privacy.",
            "failureLine": "Senza codice fiscale non posso procedere."
          },
          {
            "prompt": "Deve firmare questi moduli per la privacy.",
            "hint": "Te indica que firmes y tú preguntas dónde.",
            "choices": [
              "Dove devo firmare esattamente?",
              "Dove devo fare la firma?",
              "Dove si firma?"
            ],
            "correct": 0,
            "explanation": "'Dove devo firmare...?' es la forma activa y cortés para preguntar por el espacio de firma.",
            "successLine": "Qui in basso a destra. Grazie! Il conto è attivo.",
            "failureLine": "Non capisco."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! C'è un tasso di interesse favorevole per i depositi vincolati oggi.",
          "es": "¡Buenos días! Hay una tasa de interés favorable para los depósitos a plazo hoy."
        },
        "dialogue": [
          {
            "prompt": "Qual è il tasso di rendimento annuo netto?",
            "hint": "Preguntas por el rendimiento neto anual.",
            "choices": [
              "Qual è il tasso di rendimento annuo netto?",
              "Quanto rendimento netto c'è all'anno?",
              "Qual è la percentuale netta?"
            ],
            "correct": 0,
            "explanation": "Pregunta técnica correcta de nivel B1 usando 'tasso di rendimento'.",
            "successLine": "Il tasso netto è dell'uno e mezzo percento.",
            "failureLine": "Non capisco la domanda."
          },
          {
            "prompt": "Il tasso netto è dell'uno e mezzo percento. Ci sono penali in caso di svincolo?",
            "hint": "Pregunta si hay penalización por retiro anticipado.",
            "choices": [
              "Sì, si perde una parte degli interessi accumulati.",
              "Sì, si pagano penali molto alte.",
              "No, non ci sono commissioni."
            ],
            "correct": 0,
            "explanation": "El retiro anticipado ('svincolo') en depósitos italianos suele penalizar perdiendo intereses acumulados.",
            "successLine": "Esatto. Ci sono altre operazioni che desidera fare?",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "spiaggia",
    "level": "A2",
    "place": "Spiaggia",
    "npc": "Bagnino Gianni",
    "pos": {
      "x": 30,
      "z": 24
    },
    "color": "#e8464b",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Alquilar servicios en la playa",
    "grammar": [
      "ce l'ho idiomatico",
      "preposizioni di tempo per tutto/a"
    ],
    "vocabTargets": [
      "ombrellone",
      "lettino",
      "crema solare",
      "onde",
      "chiosco"
    ],
    "communicativeFunction": "renting",
    "errorTypes": [
      "idiom",
      "interference"
    ],
    "prerequisites": [
      "stazione"
    ],
    "greeting": {
      "it": "Buongiorno! Benvenuto al Bagno Sole. Servono ombrelloni o lettini?",
      "es": "¡Buenos días! Bienvenido al Bagno Sole. ¿Necesitan sombrillas o tumbonas?"
    },
    "vocab": [
      {
        "it": "Ombrellone",
        "es": "Sombrilla"
      },
      {
        "it": "Lettino",
        "es": "Tumbona"
      },
      {
        "it": "Crema solare",
        "es": "Protector solar"
      },
      {
        "it": "Onde",
        "es": "Olas"
      },
      {
        "it": "Spiaggia",
        "es": "Playa"
      }
    ],
    "dialogue": [
      {
        "prompt": "Vuole affittare un ombrellone?",
        "hint": "Pregunta si quieres alquilar una sombrilla.",
        "choices": [
          "Sì, quanto costa?",
          "Sì, quante costa?",
          "Quanto per un ombrellone?"
        ],
        "correct": 0,
        "explanation": "'Si, quanto costa?' es la respuesta mas natural.",
        "successLine": "Quindici euro per tutto il giorno. Also due lettini?",
        "failureLine": "Spiacente, tutti gli ombrelloni sono prenotati oggi."
      },
      {
        "prompt": "Ha la crema solare? Il sole è forte oggi.",
        "hint": "Recomienda usar protector solar.",
        "choices": [
          "Sì, ce l'ho. Grazie.",
          "Sì, la tengo. Grazie.",
          "Sì, ho la crema. Grazie."
        ],
        "correct": 0,
        "explanation": "'Ce l'ho' es la forma idiomatica obligatoria para 'la tengo' con objetos.",
        "successLine": "Bene. Se ha bisogno, sono al chiosco blu.",
        "failureLine": "Attento alle meduse oggi, ce ne sono tante."
      }
    ],
    "success": "Gianni ti dà il posto migliore, proprio davanti al mare.",
    "failure": "Il vento porta via il tuo ombrellone. Finisci scottato.",
    "reward": {
      "name": "Granita",
      "points": 20,
      "color": "#E8464B"
    },
    "failEvent": "badOutfit",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Giornata splendida oggi per stare in spiaggia!",
          "es": "¡Buenos días! ¡Espléndido día hoy para estar en la playa!"
        },
        "dialogue": [
          {
            "prompt": "Vuole anche due lettini con l'ombrellone?",
            "hint": "Ofrece dos tumbonas. Di que sí, para todo el día.",
            "choices": [
              "Sì, per tutta la giornata, grazie.",
              "Sì, per tutto la giornata, grazie.",
              "Sì, per tutta il giorno, grazie."
            ],
            "correct": 0,
            "explanation": "'Per tutta la giornata' — concordancia femenina con 'giornata'.",
            "successLine": "Venti euro in totale. Prima o seconda fila?",
            "failureLine": "Quanto tempo, scusi?"
          },
          {
            "prompt": "Il sole picchia forte. Ha la crema solare?",
            "hint": "Pregunta si tienes protector. Di que sí, lo tienes en la bolsa.",
            "choices": [
              "Sì, ce l'ho nella borsa.",
              "Sì, la ho nella borsa.",
              "Sì, ce la ho nella borsa."
            ],
            "correct": 0,
            "explanation": "'Ce l'ho' — forma idiomática con elisión obligatoria.",
            "successLine": "Bene. Attenzione alle onde alte oggi!",
            "failureLine": "Si copra, il sole è pericoloso."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Vuoi posizionarti in prima fila vicino alla riva?",
          "es": "¡Hola! ¿Quieres colocarte en primera fila cerca de la orilla?"
        },
        "dialogue": [
          {
            "prompt": "La prima fila è tutta prenotata, va bene la seconda?",
            "hint": "Te avisa que la primera fila está ocupada y ofrece la segunda.",
            "choices": [
              "Sì, va bene lo stesso.",
              "Sì, va benissimo lo stesso.",
              "Sì, non fa niente."
            ],
            "correct": 0,
            "explanation": "'Va bene lo stesso' significa 'está bien de todas formas/igual'.",
            "successLine": "Ecco la chiave dello spogliatoio. Serve altro?",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Ecco la chiave dello spogliatoio. Serve altro?",
            "hint": "Te entrega la llave y ofrece algo más. Pide una toalla limpia.",
            "choices": [
              "Un asciugamano pulito, per favore.",
              "Un asciugamano pulito, se possibile.",
              "Una salvietta pulita, per piacere."
            ],
            "correct": 0,
            "explanation": "'Un asciugamano' es toalla en italiano. Es un sustantivo masculino.",
            "successLine": "Certamente, ecco qua. Buon bagno!",
            "failureLine": "Non ne abbiamo."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! La bandiera rossa è alzata oggi. C'è vento forte.",
          "es": "¡Buenos días! La bandera roja está izada hoy. Hay viento fuerte."
        },
        "dialogue": [
          {
            "prompt": "La bandiera rossa è alzata. Cosa significa?",
            "hint": "Preguntas por el significado de la bandera roja en la playa.",
            "choices": [
              "Significa che è pericoloso fare il bagno.",
              "Significa che non si può nuotare oggi.",
              "Significa che il mare è molto agitato."
            ],
            "correct": 0,
            "explanation": "'È pericoloso fare il bagno' es la advertencia de seguridad estándar en playas italianas.",
            "successLine": "Esatto. Si consiglia di non allontanarsi dalla riva.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Esatto. Si consiglia di non allontanarsi dalla riva.",
            "hint": "Te aconseja no alejarte y tú respondes cortésmente agradeciendo la advertencia.",
            "choices": [
              "Grazie bagnino, farò attenzione.",
              "D'accordo, grazie del consiglio.",
              "D'accordo, grazie del avvertimento."
            ],
            "correct": 0,
            "explanation": "'Bagnino' es salvavidas/socorrista. Agradecer formalmente es adecuado.",
            "successLine": "D'accordo. Buon relax in spiaggia!",
            "failureLine": "Attenzione."
          }
        ]
      }
    ]
  },
  {
    "id": "cinema",
    "level": "A2",
    "place": "Cinema",
    "npc": "Cassiera Helena",
    "pos": {
      "x": -10,
      "z": 28
    },
    "color": "#f5d76e",
    "cefr": "A2",
    "skill": "interaction",
    "canDo": "Comprar entradas de cine y elegir asiento",
    "grammar": [
      "pronomi interrogativi quale/quali",
      "preposizioni di luogo in fondo/vicino a"
    ],
    "vocabTargets": [
      "film",
      "orario",
      "posto",
      "fila",
      "spettacolo"
    ],
    "communicativeFunction": "shopping",
    "errorTypes": [
      "interference",
      "preposition"
    ],
    "prerequisites": [
      "farmacia",
      "spiaggia"
    ],
    "greeting": {
      "it": "Buonasera! Cinema Plaza. Quale film desidera vedere stasera?",
      "es": "¡Buenas noches! Cinema Plaza. ¿Qué película desea ver esta noche?"
    },
    "vocab": [
      {
        "it": "Film",
        "es": "Pelicula"
      },
      {
        "it": "Orario",
        "es": "Horario"
      },
      {
        "it": "Posto",
        "es": "Asiento"
      },
      {
        "it": "Fila",
        "es": "Fila"
      },
      {
        "it": "Spettacolo",
        "es": "Funcion"
      }
    ],
    "dialogue": [
      {
        "prompt": "Quale film vuole vedere?",
        "hint": "Pregunta que pelicula quieres ver.",
        "choices": [
          "Quale mi consiglia?",
          "Quale mi raccomanda?",
          "Cosa c'è di bello?"
        ],
        "correct": 0,
        "explanation": "'Quale mi consiglia?' = 'Cual me recomienda?' usando el verbo 'consigliare'.",
        "successLine": "C'è un bellissimo film italiano! Inizia alle 21.",
        "failureLine": "Quel film è tutto esaurito. Ne scelga un altro."
      },
      {
        "prompt": "Dove preferisce sedersi?",
        "hint": "Pregunta donde prefieres sentarte.",
        "choices": [
          "In fondo, vicino al centro.",
          "In dietro, vicino il centro.",
          "In ultima fila, al centro."
        ],
        "correct": 0,
        "explanation": "'In fondo, vicino al centro' describe bien la posicion deseada.",
        "successLine": "Ecco i biglietti! Buona visione!",
        "failureLine": "Quei posti sono già occupati. Scelga un'altra fila."
      }
    ],
    "success": "Helena ti dà i posti migliori della sala.",
    "failure": "Entri nella sala sbagliata. Il film è già iniziato.",
    "reward": {
      "name": "Popcorn",
      "points": 15,
      "color": "#F5D76E"
    },
    "failEvent": "awkward",
    "progression": [
      {
        "greeting": {
          "it": "Buonasera! Abbiamo tre spettacoli in programma stasera.",
          "es": "¡Buenas noches! Tenemos tres funciones programadas para esta noche."
        },
        "dialogue": [
          {
            "prompt": "Per quale spettacolo, quello delle otto o delle dieci?",
            "hint": "Pregunta por la función. Elige la de las ocho.",
            "choices": [
              "Quello delle otto, per favore.",
              "Quale delle otto, per favore.",
              "Quello di le otto, per favore."
            ],
            "correct": 0,
            "explanation": "'Quello delle otto' (di + le). 'Quale' es interrogativo, no demostrativo.",
            "successLine": "Perfetto. Quanti biglietti?",
            "failureLine": "Non ho capito l'orario."
          },
          {
            "prompt": "Dove preferisce sedersi in sala?",
            "hint": "Pregunta dónde sentarte. Di que cerca del pasillo.",
            "choices": [
              "Vicino al corridoio, se possibile.",
              "Vicino del corridoio, se possibile.",
              "Vicino il corridoio, se possibile."
            ],
            "correct": 0,
            "explanation": "'Vicino al corridoio' — 'vicino a' + 'il' = 'al'.",
            "successLine": "Ottimo, fila G. Buona visione!",
            "failureLine": "Quei posti sono occupati, scelga altro."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! Ci sono rimasti solo pochi posti per l'ultimo spettacolo.",
          "es": "¡Hola! Solo nos quedan pocos asientos para la última función."
        },
        "dialogue": [
          {
            "prompt": "Il film comincia tra cinque minuti. Ha già i popcorn?",
            "hint": "Te avisa que el film empieza en 5 minutos y pregunta por las palomitas.",
            "choices": [
              "No, li compro subito al chiosco.",
              "Sì, li ho comprati al chiosco.",
              "Sì, ce l'ho comprati."
            ],
            "correct": 0,
            "explanation": "'Li compro' usa el pronombre directo plural 'li' (refiriéndose a los popcorn).",
            "successLine": "Entri pure dalla sala numero quattro.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Entri pure dalla sala numero quattro. Sa dove si trova?",
            "hint": "Te indica que entres a la sala 4 y pregunta si sabes dónde está.",
            "choices": [
              "Grazie. Dove si trova la sala quattro?",
              "Grazie. Dove sta la sala quattro?",
              "D'accordo. Qual è la strada?"
            ],
            "correct": 0,
            "explanation": "'Dove si trova...?' es la forma locativa reflexiva estándar.",
            "successLine": "Lungo il corridoio, la seconda porta a sinistra.",
            "failureLine": "Non capisco."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Abbiamo delle tariffe speciali per studenti oggi. Mostri pure il tesserino.",
          "es": "¡Buenos días! Tenemos tarifas especiales para estudiantes hoy. Muestre su carné."
        },
        "dialogue": [
          {
            "prompt": "Mostri pure il tesserino dello studente.",
            "hint": "Te pide mostrar el carné y tú lo entregas.",
            "choices": [
              "Ecco il tesserino, ho diritto alla riduzione?",
              "Tenga il tesserino, ho diritto alla riduzione?",
              "Ecco la tessera, c'è sconto?"
            ],
            "correct": 0,
            "explanation": "'Diritto alla riduzione' es la locución formal para derecho a descuento de estudiante.",
            "successLine": "Grazie. Il prezzo del biglietto ridotto è di sei euro.",
            "failureLine": "Tesserino non valido."
          },
          {
            "prompt": "Il prezzo del biglietto ridotto è di sei euro. Desidera altro?",
            "hint": "Te da el precio y pregunta si deseas algo más. Rechaza de forma cortés.",
            "choices": [
              "No, sono a posto così. Grazie.",
              "No, va bene così. Grazie.",
              "No, sono bene, grazie."
            ],
            "correct": 0,
            "explanation": "'Sono a posto così' es la fórmula educada italiana de rechazo ('estoy bien así').",
            "successLine": "Ecco il biglietto. Buono spettacolo!",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "ospedale",
    "level": "B1",
    "place": "Pronto Soccorso",
    "npc": "Infermiere Igor",
    "pos": {
      "x": -8,
      "z": 30
    },
    "color": "#6b8e23",
    "cefr": "B1",
    "skill": "interaction",
    "canDo": "Describir sintomas medicos con precision",
    "grammar": [
      "aggettivi qualificativi acuto/cronico",
      "preposizioni di tempo in/da"
    ],
    "vocabTargets": [
      "dolore",
      "sintomo",
      "allergia",
      "farmaco",
      "gravita"
    ],
    "communicativeFunction": "describing",
    "errorTypes": [
      "gender",
      "conjugation"
    ],
    "prerequisites": [
      "parco",
      "banca"
    ],
    "greeting": {
      "it": "Buongiorno. Pronto Soccorso. Qual è la natura dell'emergenza?",
      "es": "¡Buenos días! Urgencias. ¿Cuál es la naturaleza de la emergencia?"
    },
    "vocab": [
      {
        "it": "Dolore",
        "es": "Dolor"
      },
      {
        "it": "Sintomo",
        "es": "Sintoma"
      },
      {
        "it": "Allergia",
        "es": "Alergia"
      },
      {
        "it": "Farmaco",
        "es": "Medicamento"
      },
      {
        "it": "Gravita",
        "es": "Gravedad"
      }
    ],
    "dialogue": [
      {
        "prompt": "Che tipo di dolore sente?",
        "hint": "Pregunta que tipo de dolor sientes.",
        "choices": [
          "È un dolore acuto allo stomaco.",
          "È un dolore aguto allo stomaco.",
          "È acuto. Nello stomaco."
        ],
        "correct": 0,
        "explanation": "'Dolore acuto allo stomaco' = 'dolor agudo en el estomago'. Usa la preposicion articulada 'allo'.",
        "successLine": "Da quanto tempo? Ha mangiato qualcosa di strano?",
        "failureLine": "Deve descrivere meglio il dolore. Scala da uno a dieci?"
      },
      {
        "prompt": "Ha qualche allergia ai farmaci?",
        "hint": "Pregunta por allergias a medicamentos.",
        "choices": [
          "No, nessuna allergia nota.",
          "No, nessuna di allergie.",
          "Non che io ricordi."
        ],
        "correct": 0,
        "explanation": "'Nessuna allergia nota' = 'ninguna allergia conocida'. Correcto y formal.",
        "successLine": "Bene. Le farò una visita veloce.",
        "failureLine": "Devo fare attenzione allora. Quali farmaci le danno reazione?"
      }
    ],
    "success": "Igor ti visita subito e ti prescrive qualcosa di efficace.",
    "failure": "Ti mettono nella sala d'attesa per ore.",
    "reward": {
      "name": "Minestrone",
      "points": 40,
      "color": "#6B8E23"
    },
    "failEvent": "dizzy",
    "progression": [
      {
        "greeting": {
          "it": "Salve. Dobbiamo fare l'accettazione medica prima della visita.",
          "es": "¡Hola! Debemos hacer el registro médico antes de la consulta."
        },
        "dialogue": [
          {
            "prompt": "Da quanto tempo sente questo dolore?",
            "hint": "Pregunta desde cuándo. Di que hace tres días y que hoy empeoró.",
            "choices": [
              "Da tre giorni, ma oggi è peggiorato.",
              "Fa tre giorni, ma oggi è peggiorato.",
              "Da tre giorni, ma oggi ha peggiorato."
            ],
            "correct": 0,
            "explanation": "'Da tre giorni' para duración continua; 'peggiorare' usa 'essere' (è peggiorato).",
            "successLine": "È un dolore continuo o va e viene?",
            "failureLine": "Devo capire meglio la durata."
          },
          {
            "prompt": "Come descriverebbe il dolore?",
            "hint": "Pide describir el dolor. Di que es agudo y continuo.",
            "choices": [
              "È un dolore acuto e continuo.",
              "È un dolore acuta e continua.",
              "È un dolore aguto e continuo."
            ],
            "correct": 0,
            "explanation": "'Dolore' es masculino: 'acuto e continuo'. Y es 'acuto', no 'aguto'.",
            "successLine": "Bene. Le misuro la pressione e vediamo.",
            "failureLine": "Non capisco, mi dia più dettagli."
          }
        ]
      },
      {
        "greeting": {
          "it": "Salve. La dottoressa la visiterà a breve. Si accomodi sulla sedia.",
          "es": "¡Hola! La doctora le visitará en breve. Acomódese en la silla."
        },
        "dialogue": [
          {
            "prompt": "Sente dolore quando premo qui sulla pancia?",
            "hint": "Pregunta si sientes dolor al palpar el abdomen.",
            "choices": [
              "Sì, fa piuttosto male.",
              "Sì, fa abbastanza male.",
              "Sì, sento dolore forte."
            ],
            "correct": 0,
            "explanation": "'Fa piuttosto male' indica intensidad significativa ('duele bastante') de forma natural.",
            "successLine": "Dobbiamo fare un prelievo del sangue per sicurezza.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Dobbiamo fare un prelievo del sangue per sicurezza.",
            "hint": "Indica análisis de sangre y tú preguntas por los resultados.",
            "choices": [
              "D'accordo. Quando avremo i risultati?",
              "D'accordo. Quando staremo i risultati?",
              "Va bene. Quando arrivano i risultati?"
            ],
            "correct": 0,
            "explanation": "El futuro del verbo avere es 'avremo' (tendremos los resultados).",
            "successLine": "Tra circa un'ora. Rimanga in attesa.",
            "failureLine": "Non capisco."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno. Prima di dimetterla dobbiamo compilare la cartella clinica.",
          "es": "¡Buenos días! Antes de darle el alta debemos rellenar el historial clínico."
        },
        "dialogue": [
          {
            "prompt": "Ha un medico di base registrato qui in città?",
            "hint": "Pregunta si tienes médico de cabecera registrado.",
            "choices": [
              "Sì, il dottor Rossi della clinica nord.",
              "Sì, ho il dottor Rossi.",
              "No, non ce l'ho."
            ],
            "correct": 0,
            "explanation": "Al referirse a un médico por su apellido, se usa obligatoriamente el artículo determinativo 'il dottor'.",
            "successLine": "Bene, invierò il referto a lui. Le prescrivo dei medicinali.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Le diamo questa ricetta per dei medicinali da prendere a casa.",
            "hint": "Te entrega la receta para la recuperación en casa.",
            "choices": [
              "Grazie. Devo tornare per un controllo?",
              "Grazie. C'è bisogno di tornare?",
              "Grazie. Tornerò per controllo?"
            ],
            "correct": 0,
            "explanation": "'Tornare per un controllo' es la locución médica para visitas de revisión.",
            "successLine": "Sì, tra una settimana dal suo medico. Arrivederci!",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  },
  {
    "id": "libreria",
    "level": "B1",
    "place": "Libreria",
    "npc": "Libraia Laura",
    "pos": {
      "x": 8,
      "z": 28
    },
    "color": "#c4956a",
    "cefr": "B1",
    "skill": "interaction",
    "canDo": "Hablar sobre gustos literarios y recibir recomendaciones",
    "grammar": [
      "condizionale mi piacerebbe",
      "pronomi diretti lo/la"
    ],
    "vocabTargets": [
      "genere",
      "autore",
      "consiglio",
      "romanzo",
      "scaffale"
    ],
    "communicativeFunction": "discussing",
    "errorTypes": [
      "conjugation",
      "interference"
    ],
    "prerequisites": [
      "ristorante",
      "festa"
    ],
    "greeting": {
      "it": "Buongiorno, benvenuto nella nostra libreria. Cerca una lettura speciale?",
      "es": "¡Buenos días! Bienvenido a nuestra librería. ¿Busca una lectura especial?"
    },
    "vocab": [
      {
        "it": "Genere",
        "es": "Genero"
      },
      {
        "it": "Autore",
        "es": "Autor"
      },
      {
        "it": "Consiglio",
        "es": "Consejo"
      },
      {
        "it": "Romanzo",
        "es": "Novela"
      },
      {
        "it": "Scaffale",
        "es": "Estante"
      }
    ],
    "dialogue": [
      {
        "prompt": "Che genere di libri le piace?",
        "hint": "Pregunta que genero de libros te gusta.",
        "choices": [
          "Mi piacciono i romanzi storici.",
          "Mi piacciono i romanze storici.",
          "Preferisco romanzi storici, per piacere."
        ],
        "correct": 0,
        "explanation": "'Mi piacciono i romanzi' = 'me gustan las novelas'. 'Romanzi' no 'romances' en italiano.",
        "successLine": "Allora ho il libro perfetto per Lei!",
        "failureLine": "Quel genere è in un altro scaffale. La accompagno."
      },
      {
        "prompt": "Conosce questo autore italiano?",
        "hint": "Pregunta si conoces a este autor italiano.",
        "choices": [
          "No, ma mi piacerebbe scoprirlo.",
          "No, ma mi piacerebbe conoscerlo.",
          "Non lo conosco, ma sembra interessante."
        ],
        "correct": 0,
        "explanation": "'Mi piacerebbe scoprirlo' = 'me gustaria descubrirlo'. Uso correcto del condicional.",
        "successLine": "Provi questo allora. È il suo capolavoro.",
        "failureLine": "È un po' difficile per chi studia italiano. Vuole qualcosa di più semplice?"
      }
    ],
    "success": "Laura ti consiglia un libro perfetto per il tuo livello.",
    "failure": "Compri un libro in dialetto siciliano. Non capisci niente.",
    "reward": {
      "name": "Biscotti",
      "points": 30,
      "color": "#C4956A"
    },
    "failEvent": "awkward",
    "progression": [
      {
        "greeting": {
          "it": "Buongiorno! Posso aiutarla a trovare qualche autore o romanzo?",
          "es": "¡Buenos días! ¿Puedo ayudarle a encontrar algún autor o novela?"
        },
        "dialogue": [
          {
            "prompt": "Sta cercando un regalo o qualcosa per Lei?",
            "hint": "Pregunta si es un regalo. Di que un regalo y pide (cortés) que te aconseje una novela.",
            "choices": [
              "Un regalo. Mi consiglierebbe un romanzo?",
              "Un regalo. Mi consiglia un romanzo?",
              "Un regalo. Mi puoi consigliare un romanzo?"
            ],
            "correct": 0,
            "explanation": "El condicional 'consiglierebbe' es más cortés para una petición formal (Lei).",
            "successLine": "Certo. Le piace la narrativa o la saggistica?",
            "failureLine": "Per chi è il regalo, mi scusi?"
          },
          {
            "prompt": "Questo romanzo è molto amato. Lo conosce?",
            "hint": "Pregunta si conoces la novela. Di que no y pide que te la aconseje.",
            "choices": [
              "No, non lo conosco. Me lo consiglia?",
              "No, non la conosco. Me la consiglia?",
              "No, non conosco lo. Me lo consiglia?"
            ],
            "correct": 0,
            "explanation": "'Romanzo' es masculino → pronombre 'lo', antepuesto al verbo: 'non lo conosco'.",
            "successLine": "Glielo incarto? È un'ottima scelta.",
            "failureLine": "Ne cerchiamo un altro allora."
          }
        ]
      },
      {
        "greeting": {
          "it": "Ciao! C'è una promozione speciale sulle novità editoriali oggi.",
          "es": "¡Hola! Hay una promoción especial en las novedades editoriales hoy."
        },
        "dialogue": [
          {
            "prompt": "Cerca un saggio di storia o un romanzo di narrativa?",
            "hint": "Te pregunta si buscas ensayo histórico o novela narrativa.",
            "choices": [
              "Preferisco un romanzo di narrativa contemporanea.",
              "Voglio un saggio di storia, grazie.",
              "Mi piacerebbe una lettura leggera."
            ],
            "correct": 0,
            "explanation": "'Narrativa contemporanea' es el género literario estándar para novelas actuales.",
            "successLine": "Questo libro ha vinto un premio importante l'anno scorso.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Questo libro ha vinto un premio importante l'anno scorso.",
            "hint": "Te cuenta del premio de la novela y tú preguntas por la trama.",
            "choices": [
              "Davvero? Di cosa parla la trama?",
              "Davvero? Qual è il soggetto del libro?",
              "Interessante. Chi lo ha scritto?"
            ],
            "correct": 0,
            "explanation": "'La trama' es el argumento del libro en italiano.",
            "successLine": "Parla di una famiglia durante il dopoguerra. Molto avvincente!",
            "failureLine": "Non ricordo."
          }
        ]
      },
      {
        "greeting": {
          "it": "Buongiorno! Organizziamo un gruppo di lettura ogni giovedì sera. Le piacerebbe partecipare?",
          "es": "¡Buenos días! Organizamos un grupo de lectura cada jueves por la noche. ¿Le gustaría participar?"
        },
        "dialogue": [
          {
            "prompt": "Discuteremo di classici della letteratura europea. Partecipa?",
            "hint": "Te invita y tú expresas interés con entusiasmo.",
            "choices": [
              "Che bella iniziativa! A che ora inizia?",
              "Che bella idea! Come posso iscrivermi?",
              "Interessante. Chi partecipa?"
            ],
            "correct": 0,
            "explanation": "'Che bella iniziativa!' es una expresión cortés y entusiasta para propuestas culturales.",
            "successLine": "Inizia alle diciannove. Non serve iscrizione, basta venire.",
            "failureLine": "Non capisco."
          },
          {
            "prompt": "Inizia alle diciannove. Non serve iscrizione, basta venire.",
            "hint": "Te confirma la hora (19:00) y dice que no requiere inscripción. Confirma asistencia futura.",
            "choices": [
              "Perfetto! Ci sarò sicuramente.",
              "D'accordo! Verrò di sicuro.",
              "Bene, ci vediamo giovedì."
            ],
            "correct": 0,
            "explanation": "El futuro de estar presente es 'ci sarò' (allí estaré).",
            "successLine": "Ottimo, a giovedì allora! Buona giornata!",
            "failureLine": "Non capisco."
          }
        ]
      }
    ]
  }
];

window.missions = missions;
