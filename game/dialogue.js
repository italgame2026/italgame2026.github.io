"use strict";

// --- Diagnóstico de error lingüístico ----------------------------------------
const errorDiagnosis = {
  formality: "Error de registro: usaste una forma demasiado informal/formal para el contexto. En italiano el registro (Lei/tu) es muy importante.",
  interference: "Error de interferencia del español: esa palabra o estructura no existe así en italiano. Es un falso amigo o calco del español.",
  plural: "Error de plural: en italiano los plurales se forman cambiando la vocal final (-o→-i, -a→-e), no añadiendo -s.",
  article: "Error de artículo: el género del sustantivo en italiano puede ser distinto al español. Revisa si es maschile (il/lo) o femminile (la).",
  preposition: "Error de preposición: en italiano las preposiciones se articulan con el artículo (a+il=al, da+il=dal, in+il=nel).",
  conjugation: "Error de conjugación: la forma verbal no es correcta para esta persona o tiempo. Revisa la terminación.",
  gender: "Error de género: este sustantivo tiene género distinto en italiano. Los sustantivos en -o son masculinos, en -a femeninos (generalmente).",
  register: "Error de registro: el nivel de formalidad no es apropiado. Con desconocidos usa la forma de cortesía (Lei, vorrei...).",
  idiom: "Error de expresión idiomática: en italiano esa idea se expresa de otra forma. No traduzcas literalmente del español.",
  tense: "Error de tiempo verbal: el tiempo usado no corresponde al contexto. Revisa la secuencia temporal."
};

function diagnoseError(mission, step, choiceIndex) {
  if (!mission.errorTypes || mission.errorTypes.length === 0) return "";
  const wrongIndex = choiceIndex;
  const errorType = mission.errorTypes[wrongIndex % mission.errorTypes.length];
  const diagnosis = errorDiagnosis[errorType];
  return diagnosis ? `<br><br><span style="color: #f2b84b; font-weight: 600;">🔍 Diagnóstico:</span> ${diagnosis}` : "";
}

const rewardEffects = {
  caffe: { desc: "Caffè: velocidad +50% por 30s", apply: () => { state.activeEffects.speedBoost = Date.now() + 30000; } },
  cornetto: { desc: "Cornetto: +15 energía", apply: () => { state.energy = Math.min(100, state.energy + 15); } },
  gelato: { desc: "Gelato: protege racha en próximo error", apply: () => { state.activeEffects.streakProtect = true; } },
  panino: { desc: "Panino: +20 energía", apply: () => { state.energy = Math.min(100, state.energy + 20); } },
  pizza: { desc: "Pizza: energía al máximo", apply: () => { state.energy = 100; } },
  tiramisu: { desc: "Tiramisù: puntos dobles en próxima misión", apply: () => { state.activeEffects.doublePoints = true; } }
};

// --- Sistema de Progresión de Niveles (B1/B2/B3) ---------------------------
function getMissionLevel(mission) {
  if (!mission) return 1;
  const savedLvl = state.missionLevels[mission.id] || 1;
  const maxLvl = maxAuthoredLevel(mission);
  return Math.min(savedLvl, maxLvl);
}

function maxAuthoredLevel(mission) {
  if (!mission) return 1;
  let maxLvl = 1;
  if (mission.progression && Array.isArray(mission.progression)) {
    maxLvl += mission.progression.length;
  }
  return Math.min(maxLvl, 4);
}

function getMissionContent(mission, level) {
  if (!mission) return null;
  
  const baseGreeting = mission.greeting || { it: "Ciao! Vuoi fare una missione?", es: "¡Hola! ¿Quieres hacer una misión?" };
  
  if (level <= 1 || !mission.progression || !Array.isArray(mission.progression) || mission.progression.length === 0) {
    return {
      greeting: baseGreeting,
      vocab: mission.vocab || [],
      dialogue: mission.dialogue || [],
      success: mission.success || "Bravo!",
      failure: mission.failure || "Ritenta!",
      reward: mission.reward || null
    };
  }
  
  const progIdx = Math.min(level - 2, mission.progression.length - 1);
  const prog = mission.progression[progIdx] || {};
  
  return {
    greeting: prog.greeting || baseGreeting,
    vocab: prog.vocab || mission.vocab || [],
    dialogue: prog.dialogue || mission.dialogue || [],
    success: prog.success || mission.success || "Bravo!",
    failure: prog.failure || mission.failure || "Ritenta!",
    reward: prog.reward || mission.reward || null
  };
}

let dialogueTranslationsVisible = false;
let currentInteractionAudioTexts = [];
let dialogueAutoSpeechTimer = null;

const exactTranslations = {
  // Saludos base
  "Buongiorno! Benvenuto al Caffè della Piazza. Cosa posso portarti oggi?": "¡Buenos días! Bienvenido al Café de la Plaza. ¿Qué puedo traerte hoy?",
  "Buongiorno! Pane fresco, focaccia calda e dolci appena sfornati. Cosa posso darti?": "¡Buenos días! Pan fresco, focaccia caliente y dulces recién horneados. ¿Qué puedo darte?",

  // Caffe - Nivel 2
  "Buongiorno! Di nuovo qui? Cosa desidera oggi?": "¡Buenos días! ¿De nuevo por aquí? ¿Qué desea hoy?",
  "Buongiorno! Di nuevo qui? Cosa desidera oggi?": "¡Buenos días! ¿De nuevo por aquí? ¿Qué desea hoy?",
  "Dammi un caffè, per favore.": "Dame un café, por favor.",

  // Caffe - Nivel 3
  "Buongiorno! Ormai sei un cliente fisso! Cosa ti preparo?": "¡Buenos días! ¡Ya eres un cliente habitual! ¿Qué te preparo?",
  "Vorrei un espresso, per favore.": "Quisiera un espresso, por favor.",
  "Desidero un espresso, per piacere.": "Deseo un espresso, por favor.",
  "Voglio un espresso, per favore.": "Quiero un espresso, por favor.",
  "Al tavolo o al banco?": "¿En la mesa o en la barra?",
  "Al banco, grazie.": "En la barra, gracias.",
  "In barra, grazie.": "En la barra, gracias.",
  "Al tavolo, per favore.": "En la mesa, por favor.",
  "Perfetto, ecco il caffè. Vuole lo scontrino?": "Perfecto, aquí está el café. ¿Quiere el recibo?",
  "Ecco il caffè. Vuole lo scontrino?": "Aquí está el café. ¿Quiere el recibo?",
  "Sì, grazie. Lo scontrino, per favore.": "Sí, gracias. El recibo, por favor.",
  "Sì, grazie. La ricevuta, per favore.": "Sí, gracias. El recibo, por favor.",
  "No, grazie. Va bene così.": "No, gracias. Así está bien.",
  "Ecco a Lei! Buona giornata!": "Aquí tiene. ¡Buen día!",

  // Caffe - Nivel 4
  "Ciao! Il solito caffè o vuoi provare qualcosa di nuovo?": "¡Hola! ¿El café de siempre o quieres probar algo nuevo?",
  "Vorrei provare il ginseng, se possibile.": "Quisiera probar el ginseng, si es posible.",
  "Voglio provare il ginseng, per piacere.": "Quiero probar el ginseng, por favor.",
  "Desidero provare il ginseng, per favore.": "Deseo probar el ginseng, por favor.",
  "In tazza grande o pequeña?": "¿En taza grande o pequeña?",
  "In tazza grande o piccola?": "¿En taza grande o pequeña?",
  "In tazza piccola, grazie.": "En taza pequeña, gracias.",
  "En taza chica, per favore.": "En taza chica, por favor.",
  "Tazza grande, grazie.": "Taza grande, gracias.",
  "D'accordo! Gradisce dello zucchero o del miele?": "¡De acuerdo! ¿Desea azúcar o miel?",
  "Zucchero di canna, per favore.": "Azúcar moreno, por favor.",
  "Zucchero del cane, per favore.": "Azúcar del perro, por favor.",
  "Miele del cane, per piacere.": "Miel del perro, por favor.",
  "Sono tre euro in totale.": "Son tres euros en total.",
  "Ecco a Lei. Tenga il resto!": "Aquí tiene. ¡Quédese con el cambio!",
  "Ecco a te. Tenga il resto!": "Aquí tienes. ¡Quédese con el cambio!",
  "Ecco a Lei. Tenga la mancia!": "Aquí tiene. ¡Quédese con la propina!",
  "Molto gentile! Buona giornata!": "¡Muy amable! ¡Buen día!",

  // Panetteria - Nivel 2
  "Buongiorno! Di cosa ha bisogno oggi? Abbiamo dell'ottima focaccia.": "¡Buenos días! ¿Qué necesita hoy? Tenemos una focaccia excelente.",
  "Buongiorno! Di cosa ha bisogno oggi?": "¡Buenos días! ¿Qué necesita hoy?",
  "Vorrei due cornetti alla crema, per favore.": "Quisiera dos croissants de crema, por favor.",
  "Desidero due cornetti alla crema, per piacere.": "Deseo dos croissants de crema, por favor.",
  "Voglio due cornetti alla crema, per favore.": "Quiero dos croissants de crema, por favor.",
  "Ecco i suoi cornetti! Desidera altro?": "¡Aquí están sus croissants! ¿Desea algo más?",

  // Panetteria - Nivel 3
  "Ciao! Vuoi il solito pane o prendi qualcosa di dolce?": "¡Hola! ¿Quieres el pan de siempre o te llevas algo dulce?",
  "Ciao! Vuoi el solito pane o prendi qualcosa di dolce?": "¡Hola! ¿Quieres el pan de siempre o te llevas algo dulce?",
  "Ciao! Vuoi il solito pane o prendi something di dolce?": "¡Hola! ¿Quieres el pan de siempre o te llevas algo dulce?",
  "Vorrei una ciabatta ben cotta, per favore.": "Quisiera una ciabatta bien hecha, por favor.",
  "Voglio una ciabatta ben cucinata, per piacere.": "Quiero una ciabatta bien hecha, por favor.",
  "Desidero una ciabatta ben fatta, per favore.": "Deseo una ciabatta bien hecha, por favor.",
  "Certo! Gradisce anche dei grissini?": "¡Claro! ¿Desea también colines?",
  "Sì, una confezione di grissini torinesi, grazie.": "Sí, un paquete de colines turineses, gracias.",
  "Sì, una scatola de grissini torinesi, grazie.": "Sí, un paquete de colines turineses, gracias.",
  "Sì, un pacchetto de grissini torinesi, per favore.": "Sí, un paquete de colines turineses, por favor.",
  "Molto bene. Ecco a te!": "¡Muy bien. ¡Aquí tienes!",

  // Panetteria - Nivel 4
  "Salve! Oggi abbiamo una specialità: focaccia di Recco. Ne vuole una porzione?": "¡Hola! Hoy tenemos una especialidad: focaccia de Recco. ¿Quiere una porción?",
  "Salve! Oggi abbiamo la focaccia di Recco. Ne vuole una porzione?": "¡Hola! Hoy tenemos la focaccia de Recco. ¿Quiere una porción?",
  "Sì, volentieri! Una porzione, grazie.": "¡Sí, con gusto! Una porción, gracias.",
  "Sì, con piacere! Un pezzo, per favore.": "¡Sí, con gusto! Un trozo, por favor.",
  "Sì, grazie! La voglio provar.": "¡Sí, gracias! La quiero probar.",
  "La riscaldo un momento?": "¿Se la caliento un momento?",
  "Sì, grazie, calda è molto meglio.": "Sí, gracias, caliente está mucho mejor.",
  "Sì, gracias, caliente è molto meglio.": "Sí, gracias, caliente está mucho mejor.",
  "Sì, grazie, calorosa è molto meglio.": "Sí, gracias, caliente está mucho mejor.",
  "Ecco a Lei! Calda e filante. Sono cinque euro.": "¡Aquí tiene! Caliente y fundente. Son cinco euros.",
  "Sono cinque euro.": "Son cinco euros.",
  "Pago con una banconota da dieci euro. Ecco a Lei.": "Pago con un billete de diez euros. Aquí tiene.",
  "Pago con un biglietto da dieci euro. Ecco a Lei.": "Pago con un billete de diez euros. Aquí tiene.",
  "Pago con carta di credito, grazie.": "Pago con tarjeta de crédito, gracias.",
  "Ecco il resto e lo scontrino. Arrivederci!": "Aquí tiene el cambio y el recibo. ¡Hasta la vista!",

  "Buongiorno! Cosa desidera?": "¡Buenos días! ¿Qué desea?",
  "Vorrei un caffè, per favore.": "Quisiera un café, por favor.",
  "Voglio un caffè, per piacere.": "Quiero un café, por favor.",
  "Desidero un caffè, per favore.": "Deseo un café, por favor.",
  "Benissimo! Lungo o ristretto?": "¡Muy bien! ¿Largo o corto/concentrado?",
  "Lungo o ristretto?": "¿Largo o corto/concentrado?",
  "Ristretto, grazie.": "Corto/concentrado, gracias.",
  "Corto, grazie.": "Corto, gracias.",
  "Piccolo, per favore.": "Pequeño, por favor.",
  "Perfetto! Vuole anche un cornetto?": "¡Perfecto! ¿Quiere también un cruasán?",
  "Sono due euro e cinquanta.": "Son dos euros con cincuenta.",
  "Ecco a Lei. Grazie!": "Aquí tiene. ¡Gracias!",
  "Ecco a te. Grazie!": "Aquí tienes. ¡Gracias!",
  "Ecco a Lei. Grazia!": "Aquí tiene. Grazia. (Incorrecto: se dice grazie)",
  "Grazie a Lei! Buona giornata!": "¡Gracias a usted! ¡Que tenga buen día!",
  "Scusi... non ho capito bene.": "Disculpe... no he entendido bien.",
  "Mmm... non è proprio così.": "Mmm... no es exactamente así.",
  "Come dice?": "¿Cómo dice?",
  "Quanti cornetti vuole?": "¿Cuántos cruasanes quiere?",
  "Due cornetti, grazie.": "Dos cruasanes, gracias.",
  "Li vuole farciti o vuoti?": "¿Los quiere rellenos o vacíos?",
  "Farciti, con crema.": "Rellenos, con crema.",
  "Vuole mele o arance?": "¿Quiere manzanas o naranjas?",
  "Vorrei delle mele, per favore.": "Quisiera unas manzanas, por favor.",
  "Quanti chili ne vuole?": "¿Cuántos kilos quiere?",
  "Un chilo, grazie.": "Un kilo, gracias.",
  "Come vuole tagliare i capelli?": "¿Cómo quiere cortarse el cabello?",
  "Solo un po', per favore.": "Solo un poco, por favor.",
  "Vuole anche la barba?": "¿Quiere también la barba?",
  "No, solo i capelli, grazie.": "No, solo el cabello, gracias.",
  "Per il centro, prenda il binario due.": "Para el centro, tome el andén dos.",
  "Grazie, vado al binario due.": "Gracias, voy al andén dos.",
  "Ha già il biglietto?": "¿Ya tiene el billete?",
  "No, dove posso comprarlo?": "No, ¿dónde puedo comprarlo?",
  "Che sintomi ha?": "¿Qué síntomas tiene?",
  "Ho mal di testa e un po' di febbre.": "Tengo dolor de cabeza y un poco de fiebre.",
  "È allergico a qualche farmaco?": "¿Es alérgico a algún medicamento?",
  "No, nessuna allergia.": "No, ninguna alergia.",
  "Che taglia porta?": "¿Qué talla usa?",
  "Porto una taglia media.": "Uso una talla mediana.",
  "Le piace questo colore o preferisce il blu?": "¿Le gusta este color o prefiere el azul?",
  "Preferisco il blu, grazie.": "Prefiero el azul, gracias.",
  "Ha prenotato un tavolo?": "¿Ha reservado una mesa?",
  "Sì, a nome di {name}.": "Sí, a nombre de {name}.",
  "Ha già deciso cosa ordinare?": "¿Ya decidió qué pedir?",
  "Prendo gli spaghetti al pomodoro.": "Tomaré los espaguetis con tomate.",
  "Desidera anche il dolce? Abbiamo tiramisù.": "¿Desea también postre? Tenemos tiramisú.",
  "Sì, volentieri! Un tiramisù.": "¡Sí, con gusto! Un tiramisú.",
  "Ti va di prendere un caffè più tardi?": "¿Te apetece tomar un café más tarde?",
  "Sì, volentieri. A che ora?": "Sí, con gusto. ¿A qué hora?",
  "Sei uno studente anche tu?": "¿Tú también eres estudiante?",
  "Sì, studio italiano.": "Sí, estudio italiano.",
  "Cono o coppetta?": "¿Cono o vasito?",
  "Un cono, per favore.": "Un cono, por favor.",
  "Un gelato al cono, per piacere.": "Un helado en cono, por favor.",
  "Cono, per piacere.": "Cono, por favor.",
  "Abbiamo finito i coni. Solo coppetta oggi!": "Se nos acabaron los conos. ¡Hoy solo hay vasito!",
  "Quanti gusti desidera?": "¿Cuántos sabores desea?",
  "Quali gusti preferisce?": "¿Qué sabores prefiere?",
  "Cioccolato e fragola.": "Chocolate y fresa.",
  "Cioccolata e fragola, per piacere.": "Chocolate y fresa, por favor.",
  "Cioccolato con fragola, per piacere.": "Chocolate con fresa, por favor.",
  "Ecco qua! Con panna? Costa solo 50 centesimi in più.": "¡Aquí tiene! ¿Con nata? Cuesta solo 50 céntimos más.",
  "La fragola è finita. Provi il pistacchio?": "La fresa se acabó. ¿Prueba el pistacho?",
  "Sono tre euro.": "Son tres euros.",
  "Ecco per Lei. Grazie!": "Esto es para usted. ¡Gracias!",
  "Ecco. Tenga.": "Aquí tiene. Tome.",
  "Grazie! Buona giornata!": "¡Gracias! ¡Que tenga buen día!",
  "Mi dispiace, non ho resto per quella banconota.": "Lo siento, no tengo cambio para ese billete.",
  "Due croissant, per favore.": "Dos croissants, por favor.",
  "Due cornetto, per piacere.": "Dos croissants, por favor.",
  "Ecco i suoi cornetti, signore!": "Aquí están sus croissants, señor.",
  "Prego? Non ho capito la quantità.": "¿Disculpe? No he entendido la cantidad.",
  "Relleni, con crema.": "Rellenos, con crema.",
  "Pieni, per favore.": "Rellenos, por favor.",
  "Ottima scelta! Sono appena sfornati.": "¡Excelente elección! Acaban de salir del horno.",
  "Non abbiamo quel ripieno, mi dispiace.": "No tenemos ese relleno, lo siento.",
  "Voglio mele, per favore.": "Quiero manzanas, por favor.",
  "Voglio mele, per piacere.": "Quiero manzanas, por favor.",
  "Benissimo! Sono molto fresche oggi.": "¡Muy bien! Están muy frescas hoy.",
  "Non ho capito... mele o arance?": "No he entendido... ¿manzanas o naranjas?",
  "Uno kilo, per favore.": "Un kilo, por favor.",
  "Un kilo, per favore.": "Un kilo, por favor.",
  "Ecco qua! Due euro, per favore.": "¡Aquí está! Dos euros, por favor.",
  "Scusi, non ho la bilancia per quella quantità.": "Disculpe, no tengo la báscula para esa cantidad.",
  "Solamente un pochino, per favore.": "Sólo un poquito, por favor.",
  "Solo un poco, per piacere.": "Sólo un poco, por favor.",
  "Va bene! Solo una spuntatina allora.": "¡De acuerdo! Entonces sólo un pequeño retoque.",
  "Come? Può ripetere?": "¿Cómo? ¿Puede repetir?",
  "No, solo il capello, grazie.": "No, sólo el pelo, gracias.",
  "No, solo la barba no, per favore.": "No, sólo la barba no, por favor.",
  "Perfetto! Dieci minuti ed è pronto!": "¡Perfecto! Diez minutos y estará listo.",
  "Ho capito male... ricominciamo da capo.": "He entendido mal... Empecemos de nuevo desde el principio.",
  "Grazie, vado alla piattaforma due.": "Gracias, voy a la plataforma dos.",
  "Grazie, vado a il binario due.": "Gracias, voy al andén dos.",
  "Esatto! Il treno arriva tra cinque minuti.": "¡Exacto! El tren llega en cinco minutos.",
  "No, guardi meglio il tabellone degli orari.": "No, mire mejor el tablero de horarios.",
  "No, dove posso a comprarlo?": "No, ¿dónde puedo comprarlo?",
  "Non ancora. Dove si compra?": "Todavía no. ¿Dónde se compra?",
  "Alla biglietteria automatica, laggiù in fondo.": "En la taquilla automática, allí al fondo.",
  "Deve convalidarlo prima di salire sul treno.": "Debe validarlo antes de subir al tren.",
  "Ho mal di testa e febbre.": "Tengo dolor de cabeza y fiebre.",
  "Ho dolore di testa e febbre.": "Tengo dolor de cabeza y fiebre.",
  "Da quanto tempo? Da ieri?": "¿Desde cuándo? ¿Desde ayer?",
  "Mi descriva meglio i sintomi, per favore.": "Descríbame mejor los síntomas, por favor.",
  "No, nessuno allergia.": "No, ninguna alergia.",
  "Non sono allergico a niente.": "No soy alérgico a nada.",
  "Bene. Le prescrivo un analgesico leggero.": "Bien. Le receto un analgésico ligero.",
  "Devo saperlo per sicurezza. Ci riprovi.": "Debo saberlo por seguridad. Inténtelo de nuevo.",
  "Uso una taglia media.": "Uso una talla media.",
  "Porto una taglia mediana.": "Uso una talla mediana.",
  "Perfetto! Abbiamo questa giacca nella sua taglia.": "¡Perfecto! Tenemos esta chaqueta en su talla.",
  "Mi dispiace, non abbiamo quella taglia in questo modello.": "Lo siento, no tenemos esa talla en este modelo.",
  "Prefero il blu, grazie.": "Prefiero el azul, gracias.",
  "Meglio il blu, per piacere.": "Mejor el azul, por favor.",
  "Buona scelta! Il blu le sta molto bene.": "¡Buena elección! El azul le queda muy bien.",
  "Non abbiamo questo colore in magazzino.": "No tenemos este color en almacén.",
  "Sì, in nome di {name}.": "Sí, a nombre de {name}.",
  "Sì, nel nome di {name}.": "Sí, a nombre de {name}.",
  "Ah, ecco! Il suo tavolo è vicino alla finestra.": "¡Ah, aquí está! Su mesa está cerca de la ventana.",
  "Non trovo la sua prenotazione. Ha il numero di conferma?": "No encuentro su reserva. ¿Tiene el número de confirmación?",
  "Prendo i spaghetti al pomodoro.": "Voy a tomar espaguetis con tomate.",
  "Voglio spaghetti con pomodoro.": "Quiero espaguetis con tomate.",
  "Ottima scelta! E da bere?": "¡Excelente elección! ¿Y para beber?",
  "Quel piatto non è disponibile oggi, mi dispiace.": "Ese plato no está disponible hoy, lo siento.",
  "Sì, certo. Un tiramisù.": "Sí, claro. Un tiramisú.",
  "Sì, con piacere. Uno tiramisù.": "Sí, con gusto. Un tiramisú.",
  "Arriva subito! Buon appetito!": "¡Llega enseguida! ¡Buen provecho!",
  "Il dolce è finito purtroppo. Vuole un caffè?": "El postre se ha acabado, desgraciadamente. ¿Quiere un café?",
  "Sì, con gusto. A che ora?": "Sí, con gusto. ¿A qué hora?",
  "D'accordo. Che ora?": "De acuerdo. ¿Qué hora?",
  "Alle cinque? Davanti alla fontana in piazza!": "¿A las cinco? ¡Delante de la fuente en la plaza!",
  "Forse un'altra volta allora... ciao!": "Quizás en otra ocasión entonces... ¡adiós!",
  "Sì, sto studiando la lingua.": "Sí, estoy estudiando el idioma.",
  "Sì, imparo l'italiano.": "Sí, estoy aprendiendo italiano.",
  "Che bello! Parli già molto bene!": "¡Qué bien! ¡Ya habla muy bien!",
  "Ah, pensavo fossi di Milano... che strano!": "Ah, pensaba que eras de Milán... ¡qué extraño!",
  "Puoi aiutarmi a trovare il tavolo delle bevande?": "¿Puedes ayudarme a encontrar la mesa de las bebidas?",
  "Certo! È vicino alla fontana.": "¡Claro! Está cerca de la fuente.",
  "Certo! È vicino al fontana.": "¡Claro! Está cerca de la fuente.",
  "Certo! Sta vicino la fontana.": "¡Claro! Está cerca de la fuente.",
  "Ah, non l'avevo visto! Grazie mille!": "¡Ah, no lo había visto! ¡Muchas gracias!",
  "Non è lì... forse hai visto male?": "No está allí... ¿quizás has visto mal?",
  "Hai visto anche il tavolo dei dolci?": "¿Has visto también la mesa de los dulces?",
  "Sì, è accanto al palco.": "Sí, está al lado del escenario.",
  "Sì, è al lato del palco.": "Sí, está al lado del escenario.",
  "Sì, sta vicino il palco.": "Sí, está cerca del escenario.",
  "Perfetto! Sei un angelo, grazie!": "¡Perfecto! Eres un ángel, gracias.",
  "Dovrei controllare meglio... ma grazie lo stesso!": "Debería comprobar mejor... ¡pero gracias de todos modos!",
  "Buonasera! Ha una prenotazione?": "¡Buenas noches! ¿Tiene una reserva?",
  "Eccola! Camera singola al terzo piano.": "¡Aquí está! Habitación individual en la tercera planta.",
  "Non trovo la sua prenotazione nel sistema.": "No encuentro su reserva en el sistema.",
  "Quante notti si ferma?": "¿Cuántas noches se queda?",
  "Tre notti, per favore.": "Tres noches, por favor.",
  "Tre nottes, per favore.": "Tres noches, por favor.",
  "Tre notte, per favore.": "Tres noches, por favor.",
  "Ecco la chiave. La colazione è dalle 7 alle 10.": "Aquí está la llave. El desayuno es de 7 a 10.",
  "Per quel periodo abbiamo solo suite disponibili.": "Para ese período tenemos sólo suites disponibles.",
  "Ha bisogno di aiuto con i bagagli?": "¿Necesita ayuda con el equipaje?",
  "No, grazie. Ho solo questa borsa.": "No, gracias. Sólo tengo esta bolsa.",
  "No, grazie. Ho solo questo borsa.": "No, gracias. Sólo tengo esta bolsa.",
  "Grazie, ma faccio da solo.": "Gracias, pero me las arreglo solo.",
  "Buon soggiorno allora! Se ha bisogno, chiami pure.": "¡Buena estancia entonces! Si necesita algo, llame sin dudar.",
  "Il facchino arriva subito... ah, ha cambiato idea?": "El mozo llega enseguida... ¡ah, ha cambiado de opinión?",
  "Dove la porto?": "¿Adónde la llevo?",
  "In centro, per favore.": "Al centro, por favor.",
  "Al centro, per favore.": "Al centro, por favor.",
  "Nel centro, per piacere.": "Al centro, por favor.",
  "D'accordo! Per la strada veloce?": "¡De acuerdo! ¿Por la carretera rápida?",
  "Non conosco quella via. Ha l'indirizzo esatto?": "No conozco esa calle. ¿Tiene la dirección exacta?",
  "Preferisce la strada panoramica? Ci mette più tempo.": "¿Prefiere la carretera panorámica? Lleva más tiempo.",
  "No, vada diretto, grazie.": "No, vaya directo, gracias.",
  "No, va diretto, grazie.": "No, vaya directo, gracias.",
  "Meglio la strada veloce.": "Mejor la carretera rápida.",
  "Va bene! Arriveremo in dieci minuti.": "¡De acuerdo! Llegaremos en diez minutos.",
  "C'è traffico sulla strada veloce oggi.": "Hay tráfico en la carretera rápida hoy.",
  "Ecco, siamo arrivati. Sono quindici euro.": "Aquí estamos, hemos llegado. Son quince euros.",
  "Ecco venti. Tenga il resto.": "Aquí tiene veinte. Quédese con el cambio.",
  "Ecco venti. Tenga il cambio.": "Aquí tiene veinte. Quédese con el cambio.",
  "Tenga. Arrivederci.": "Tenga. Adiós.",
  "Grazie! Buona permanenza in città!": "¡Gracias! ¡Disfrute su estancia en la ciudad!",
  "Mi dispiace, il POS non funziona oggi. Solo contanti.": "Lo siento, el datáfono no funciona hoy. Sólo efectivo.",
  "Intero o ridotto?": "¿Tarifa completa o reducida?",
  "Ridotto, sono studente.": "Reducida, soy estudiante.",
  "Ridotta, sono studente.": "Reducida, soy estudiante.",
  "Ridotto, perché sono un studente.": "Reducida, porque soy estudiante.",
  "Mi mostri un documento, per favore.": "Muéstreme un documento, por favor.",
  "Il ridotto è solo per under 26 con tesserino.": "La tarifa reducida es sólo para menores de 26 años con carné.",
  "Le interessa anche la mostra temporanea?": "¿Le interesa también la exposición temporal?",
  "Sì, quanto costa in più?": "Sí, ¿cuánto cuesta más?",
  "Sì, quanto costano in più?": "Sí, ¿cuánto cuestan más?",
  "Sì. Qual è il prezzo aggiuntivo?": "Sí. ¿Cuál es el precio adicional?",
  "Solo quattro euro. Ne vale la pena!": "Sólo cuatro euros. ¡Vale la pena!",
  "Purtroppo chiude tra mezz'ora. Meglio tornare domani.": "Desgraciadamente cierra en media hora. Mejor volver mañana.",
  "Vuole un sacchetto?": "¿Quiere una bolsa?",
  "Sì, grazie.": "Sí, gracias.",
  "Sì, per favore.": "Sí, por favor.",
  "D'accordo.": "De acuerdo.",
  "Sono dieci centesimi. Paga in contanti o con bancomat?": "Son diez céntimos. ¿Paga en efectivo o con tarjeta?",
  "Non ho sacchetti grandi. Le va bene uno piccolo?": "No tengo bolsas grandes. ¿Le vale una pequeña?",
  "Ha la tessera fedeltà?": "¿Tiene la tarjeta de fidelidad?",
  "No, non ce l'ho.": "No, no la tengo.",
  "No, non la tengo.": "No, no la tengo.",
  "No, non ho.": "No, no la tengo.",
  "Va bene. Sono ventidue euro in totale.": "De acuerdo. Son veintidós euros en total.",
  "Allora non posso applicare lo sconto di oggi.": "Entonces no puedo aplicar el descuento de hoy.",
  "Cosa posso fare per Lei?": "¿Qué puedo hacer por usted?",
  "Vorrei cambiare dei soldi.": "Quisiera cambiar dinero.",
  "Voglio cambiare soldi.": "Quiero cambiar dinero.",
  "Devo cambiare i miei soldi.": "Debo cambiar mi dinero.",
  "Certo! Che valuta ha?": "¡Claro! ¿Qué moneda tiene?",
  "Oggi lo sportello cambio è chiuso. Ripassi domani.": "Hoy la oficina de cambio está cerrada. Vuelva mañana.",
  "Vuole il contante o un accredito sul conto?": "¿Quiere el efectivo o un abono en cuenta?",
  "Contante, per favore.": "Efectivo, por favor.",
  "Soldi contanti, per piacere.": "Dinero en efectivo, por favor.",
  "In contanti, grazie.": "En efectivo, gracias.",
  "Ecco. Il tasso oggi è favorevole.": "Aquí está. El tipo de cambio hoy es favorable.",
  "C'è una commissione di cinque euro. Procedo lo stesso?": "Hay una comisión de cinco euros. ¿Procedo de todos modos?",
  "Vuole affittare un ombrellone?": "¿Quiere alquilar una sombrilla?",
  "Sì, quanto costa?": "Sí, ¿cuánto cuesta?",
  "Sì, quante costa?": "Sí, ¿cuánto cuesta?",
  "Quanto per un ombrellone?": "¿Cuánto por una sombrilla?",
  "Quindici euro per tutto il giorno. Anche due lettini?": "Quince euros por todo el día. ¿También dos tumbonas?",
  "Spiacente, tutti gli ombrelloni sono prenotati oggi.": "Lo siento, todas las sombrillas están reservadas hoy.",
  "Ha la crema solare? Il sole è forte oggi.": "¿Tiene crema solar? El sol es fuerte hoy.",
  "Sì, ce l'ho. Grazie.": "Sí, la tengo. Gracias.",
  "Sì, la tengo. Grazie.": "Sí, la tengo. Gracias.",
  "Sì, ho la crema. Grazie.": "Sí, tengo la crema. Gracias.",
  "Bene. Se ha bisogno, sono al chiosco blu.": "Bien. Si necesita algo, estoy en el quiosco azul.",
  "Attento alle meduse oggi, ce ne sono tante.": "Tenga cuidado con las medusas hoy, hay muchas.",
  "Quale film vuole vedere?": "¿Qué película quiere ver?",
  "Quale mi consiglia?": "¿Cuál me recomienda?",
  "Quale mi raccomanda?": "¿Cuál me recomienda?",
  "Cosa c'è di bello?": "¿Qué hay de bueno?",
  "C'è un bellissimo film italiano! Inizia alle 21.": "¡Hay una película italiana preciosa! Empieza a las 21.",
  "Quel film è tutto esaurito. Ne scelga un altro.": "Esa película está agotada. Elija otra.",
  "Dove preferisce sedersi?": "¿Dónde prefiere sentarse?",
  "In fondo, vicino al centro.": "Al fondo, cerca del centro.",
  "In dietro, vicino il centro.": "Al fondo, cerca del centro.",
  "In ultima fila, al centro.": "En la última fila, en el centro.",
  "Ecco i biglietti! Buona visione!": "¡Aquí tiene las entradas! ¡Que disfrute la película!",
  "Quei posti sono già occupati. Scelga un'altra fila.": "Esos asientos ya están ocupados. Elija otra fila.",
  "Che tipo di dolore sente?": "¿Qué tipo de dolor siente?",
  "È un dolore acuto allo stomaco.": "Es un dolor agudo en el estómago.",
  "È un dolore aguto allo stomaco.": "Es un dolor agudo en el estómago.",
  "È acuto. Nello stomaco.": "Es agudo. En el estómago.",
  "Da quanto tempo? Ha mangiato qualcosa di strano?": "¿Desde cuándo? ¿Ha comido algo extraño?",
  "Deve descrivere meglio il dolore. Scala da uno a dieci?": "Debe describir mejor el dolor. ¿En una escala del uno al diez?",
  "Ha qualche allergia ai farmaci?": "¿Tiene alguna alergia a los medicamentos?",
  "No, nessuna allergia nota.": "No, ninguna alergia conocida.",
  "No, nessuna di allergie.": "No, ninguna alergia.",
  "Non che io ricordi.": "No que yo recuerde.",
  "Bene. Le farò una visita veloce.": "Bien. Le haré una visita rápida.",
  "Devo fare attenzione allora. Quali farmaci le danno reazione?": "Debo tener cuidado entonces. ¿Qué medicamentos le dan reacción?",
  "Che genere di libri le piace?": "¿Qué género de libros le gusta?",
  "Mi piacciono i romanzi storici.": "Me gustan las novelas históricas.",
  "Mi piacciono i romanze storici.": "Me gustan las novelas históricas.",
  "Preferisco romanzi storici, per piacere.": "Prefiero novelas históricas, por favor.",
  "Allora ho il libro perfetto per Lei!": "¡Entonces tengo el libro perfecto para usted!",
  "Quel genere è in un altro scaffale. La accompagno.": "Ese género está en otro estante. La acompaño.",
  "Conosce questo autore italiano?": "¿Conoce a este autor italiano?",
  "No, ma mi piacerebbe scoprirlo.": "No, pero me gustaría descubrirlo.",
  "No, ma mi piacerebbe conoscerlo.": "No, pero me gustaría conocerlo.",
  "Non lo conosco, ma sembra interessante.": "No lo conozco, pero parece interesante.",
  "Provi questo allora. È il suo capolavoro.": "Pruebe éste entonces. Es su obra maestra.",
  "È un po' difficile per chi studia italiano. Vuole qualcosa di più semplice?": "Es un poco difícil para quien estudia italiano. ¿Quiere algo más sencillo?",
};

const translationReplacements = [
  ["per favore", "por favor"],
  ["per piacere", "por favor"],
  ["buongiorno", "buenos días"],
  ["buona giornata", "buen día"],
  ["mi dispiace", "lo siento"],
  ["non ho capito", "no he entendido"],
  ["quanto costa", "cuánto cuesta"],
  ["ecco a lei", "aquí tiene"],
  ["ecco qua", "aquí tiene"],
  ["a nome di", "a nombre de"],
  ["un po' di", "un poco de"],
  ["mal di testa", "dolor de cabeza"],
  ["ce l'ho", "lo/la tengo"],
  ["d'accordo", "de acuerdo"],
  ["volentieri", "con gusto"],
  ["vorrei", "quisiera"],
  ["voglio", "quiero"],
  ["desidero", "deseo"],
  ["desidera", "desea"],
  ["desideri", "deseas"],
  ["desideriamo", "deseamos"],
  ["vuole", "quiere"],
  ["preferisce", "prefiere"],
  ["preferisco", "prefiero"],
  ["posso", "puedo"],
  ["possiamo", "podemos"],
  ["comprare", "comprar"],
  ["comprarlo", "comprarlo"],
  ["prenda", "tome"],
  ["prendo", "tomo"],
  ["vada", "vaya"],
  ["tenga", "tome"],
  ["provi", "pruebe"],
  ["grazie", "gracias"],
  ["scusi", "disculpe"],
  ["prego", "de nada"],
  ["sì", "sí"],
  ["no", "no"],
  ["dove", "dónde"],
  ["quanti", "cuántos"],
  ["quante", "cuántas"],
  ["quale", "cuál"],
  ["quali", "cuáles"],
  ["che", "qué"],
  ["come", "cómo"],
  ["cosa", "qué"],
  ["sono", "son"],
  ["ho", "tengo"],
  ["ha", "tiene"],
  ["è", "es"],
  ["abbiamo", "tenemos"],
  ["finito", "acabado"],
  ["finita", "acabada"],
  ["solo", "solo"],
  ["oggi", "hoy"],
  ["bene", "bien"],
  ["perfetto", "perfecto"],
  ["benissimo", "muy bien"],
  ["per favore", "por favor"],
  ["caffè", "café"],
  ["cornetto", "cruasán"],
  ["cornetti", "cruasanes"],
  ["cono", "cono"],
  ["coni", "conos"],
  ["coppetta", "vasito"],
  ["gelato", "helado"],
  ["gusti", "sabores"],
  ["panna", "nata"],
  ["cioccolato", "chocolate"],
  ["cioccolata", "chocolate"],
  ["fragola", "fresa"],
  ["pistacchio", "pistacho"],
  ["euro", "euros"],
  ["centesimi", "céntimos"],
  ["banconota", "billete"],
  ["resto", "cambio"],
  ["ristretto", "café corto/concentrado"],
  ["lungo", "café largo"],
  ["centro", "centro"],
  ["binario", "andén"],
  ["biglietto", "billete"],
  ["capelli", "cabello"],
  ["barba", "barba"],
  ["mele", "manzanas"],
  ["arance", "naranjas"],
  ["chilo", "kilo"],
  ["farmaco", "medicamento"],
  ["allergia", "alergia"],
  ["febbre", "fiebre"],
  ["taglia", "talla"],
  ["blu", "azul"],
  ["tavolo", "mesa"],
  ["dolce", "postre"],
  ["studente", "estudiante"]
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fillPlayerName(text) {
  return String(text || "").replace(/\{name\}/g, state.playerName || "Studente");
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getDisplayChoices(mission, step) {
  const choices = step.choices.map((text, originalIndex) => ({ text, originalIndex }));
  if (choices.length <= 1) return choices;

  const correctChoice = choices.find(choice => choice.originalIndex === step.correct);
  const others = choices.filter(choice => choice.originalIndex !== step.correct);
  const seed = hashString(`${mission.id}:${state.dialogueTurn}:${step.prompt}`);

  for (let i = others.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [others[i], others[j]] = [others[j], others[i]];
  }

  const correctSlot = (seed % (choices.length - 1)) + 1;
  const ordered = [];
  ordered[correctSlot] = correctChoice;

  let otherIndex = 0;
  for (let i = 0; i < choices.length; i++) {
    if (!ordered[i]) ordered[i] = others[otherIndex++];
  }

  return ordered;
}

function getTextTranslation(text, context = {}) {
  const filledText = fillPlayerName(text);
  const exact = exactTranslations[text] || exactTranslations[filledText];
  if (exact) return fillPlayerName(exact);

  if (context.kind === "prompt" && context.step?.hint) {
    return context.step.hint;
  }

  return approximateItalianTranslation(filledText);
}

function approximateItalianTranslation(text) {
  let translated = String(text || "").toLowerCase();
  translated = translated
    .replace(/[¿?]/g, "")
    .replace(/[¡!]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  translationReplacements
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([it, es]) => {
      translated = translated.replace(new RegExp(`\\b${escapeRegExp(it)}\\b`, "gi"), es);
    });

  translated = translated
    .replace(/\bil\b/g, "el")
    .replace(/\blo\b/g, "el")
    .replace(/\bla\b/g, "la")
    .replace(/\bi\b/g, "los")
    .replace(/\bgli\b/g, "los")
    .replace(/\ble\b/g, "las")
    .replace(/\bun\b/g, "un")
    .replace(/\buna\b/g, "una")
    .replace(/\bdei\b/g, "unos")
    .replace(/\bdelle\b/g, "unas")
    .replace(/\bal\b/g, "al")
    .replace(/\balla\b/g, "a la")
    .replace(/\bcon\b/g, "con")
    .replace(/\be\b/g, "y")
    .replace(/\bma\b/g, "pero")
    .replace(/\bdi\b/g, "de")
    .replace(/\bda\b/g, "desde")
    .replace(/\bin\b/g, "en")
    .replace(/\bper\b/g, "por")
    .replace(/\bpiù\b/g, "más")
    .replace(/\bquella\b/g, "ese")
    .replace(/\bquesto\b/g, "este")
    .replace(/\bquesta\b/g, "esta")
    .replace(/\bqualche\b/g, "algún")
    .replace(/\banche\b/g, "también")
    .replace(/\bgià\b/g, "ya")
    .replace(/\bnon\b/g, "no");

  translated = translated
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!translated) return "";
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translationHtml(text, context = {}) {
  const visibleClass = dialogueTranslationsVisible ? " visible" : "";
  return `<span class="translation-line${visibleClass}">${escapeHtml(getTextTranslation(text, context))}</span>`;
}

function setTranslationsVisible(visible) {
  dialogueTranslationsVisible = visible;
  document.querySelectorAll("#dialogue-panel .translation-line").forEach(line => {
    line.classList.toggle("visible", visible);
  });
  document.querySelectorAll("#dialogue-panel .translate-option-btn, #translateDialogueBtn, #translateFeedbackBtn").forEach(btn => {
    btn.classList.toggle("active", visible);
    btn.setAttribute("aria-pressed", visible ? "true" : "false");
  });
}

function toggleTranslationNear(button, selector) {
  const container = button.closest(selector);
  const line = container ? container.querySelector(".translation-line") : null;
  if (!line) return;
  const visible = !line.classList.contains("visible");
  line.classList.toggle("visible", visible);
  button.classList.toggle("active", visible);
  button.setAttribute("aria-pressed", visible ? "true" : "false");
}

function setupDialogueHeaderTools() {
  const playAllBtn = document.getElementById("dialoguePlayAllBtn");
  const closeBtn = document.getElementById("dialogueClose");

  if (closeBtn) {
    closeBtn.onclick = closeDialogue;
  }

  if (playAllBtn) {
    playAllBtn.style.display = "inline-flex";
    playAllBtn.onclick = () => {
      toggleCurrentInteractionAudio();
    };
  }
}

function playCurrentInteractionAudio() {
  if (typeof window.speakItalianSequence === "function") {
    window.speakItalianSequence(currentInteractionAudioTexts);
  }
}

function toggleCurrentInteractionAudio() {
  if (typeof window.stopItalianSpeech === "function" && window.stopItalianSpeech()) {
    return;
  }
  playCurrentInteractionAudio();
}

function queueCurrentInteractionAudio() {
  if (dialogueAutoSpeechTimer) clearTimeout(dialogueAutoSpeechTimer);
  dialogueAutoSpeechTimer = setTimeout(() => {
    if (state.inDialogue) playCurrentInteractionAudio();
  }, 180);
}

function handleDialogueShortcuts(e) {
  if (!state.inDialogue) return;
  const target = e.target;
  if (target && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)) return;

  const key = e.key.toLowerCase();
  if (key === "n") {
    e.preventDefault();
    toggleCurrentInteractionAudio();
    return;
  }
  if (key === "l") {
    e.preventDefault();
    setTranslationsVisible(!dialogueTranslationsVisible);
    return;
  }
  if (key === "enter") {
    const beginBtn = document.querySelector("[data-dialogue-action='begin-mission']");
    const nextBtn = document.getElementById("dialogue-next-btn");
    if (state.inVocabPhase && beginBtn) {
      e.preventDefault();
      beginBtn.click();
    } else if (nextBtn && document.getElementById("dialogue-feedback")?.style.display === "block") {
      e.preventDefault();
      nextBtn.click();
    }
    return;
  }

  if (key.length === 1 && key >= "a" && key <= "z") {
    const feedbackVisible = document.getElementById("dialogue-feedback")?.style.display === "block";
    if (state.inVocabPhase || feedbackVisible) return;
    const optionBtn = document.querySelector(`[data-dialogue-choice-key="${key}"]`);
    if (optionBtn) {
      e.preventDefault();
      optionBtn.click();
    }
  }
}

function getDiagnosisText(mission, choiceIndex) {
  if (!mission.errorTypes || mission.errorTypes.length === 0) return "";
  const errorType = mission.errorTypes[choiceIndex % mission.errorTypes.length];
  return errorDiagnosis[errorType] || "";
}

// --- Flujo de Diálogo Interactivo --------------------------------------------
function openDialogue(mission) {
  state.inDialogue = true;
  state.activeMission = mission;
  state.dialogueTurn = 0;
  state.vocabSeen = false;
  if (typeof window.setMusicDucked === "function") window.setMusicDucked(true);

  const panel = document.getElementById("dialogue-panel");
  const speaker = document.getElementById("dialogue-speaker");
  const speakerRole = document.getElementById("dialogue-speaker-role");
  const avatarChar = document.getElementById("dialogue-avatar-char");
  const dialogueText = document.getElementById("dialogue-text");
  const optionsContainer = document.getElementById("dialogue-options");
  const feedbackPanel = document.getElementById("dialogue-feedback");

  const lvl = getMissionLevel(mission);
  const content = getMissionContent(mission, lvl);
  state.activeMissionContent = content; // cache resolved content for this session

  speaker.textContent = mission.npc;
  // Badge de Nivel (B3)
  speakerRole.textContent = `${mission.place} (${mission.level}) · Livello ${lvl}`;
  avatarChar.textContent = mission.npc ? mission.npc.charAt(0) : "G";

  feedbackPanel.style.display = "none";
  panel.style.display = "flex";
  dialogueTranslationsVisible = false;
  setupDialogueHeaderTools();

  if (content.vocab && content.vocab.length > 0) {
    state.inVocabPhase = true;
    
    // Autoplay al abrir is ONLY the greeting! "▶ Todo" plays both greeting + vocabulary sequence
    currentInteractionAudioTexts = [content.greeting.it, ...content.vocab.map(v => v.it)];
    
    const speakDialogueBtn = document.getElementById("speakDialogueBtn");
    const translateDialogueBtn = document.getElementById("translateDialogueBtn");
    if (speakDialogueBtn) {
      speakDialogueBtn.style.display = "flex";
      speakDialogueBtn.onclick = () => {
        window.speakItalian(content.greeting.it);
      };
    }
    if (translateDialogueBtn) {
      translateDialogueBtn.style.display = "inline-flex";
      translateDialogueBtn.classList.toggle("active", dialogueTranslationsVisible);
      translateDialogueBtn.setAttribute("aria-pressed", dialogueTranslationsVisible ? "true" : "false");
      translateDialogueBtn.onclick = () => setTranslationsVisible(!dialogueTranslationsVisible);
    }

    const vocabVisibleClass = dialogueTranslationsVisible ? " visible" : "";
    
    let html = "";
    
    // 1. Saludo/Oferta del NPC (B2)
    html += `
      <div class="npc-greeting-block" style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(248, 241, 223, 0.12);">
        <div style="font-size: 14.5px; font-weight: bold; color: #f2b84b; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <span style="cursor: pointer; background: rgba(242, 184, 75, 0.15); padding: 3px 9px; border-radius: 6px; font-size: 12px; color: #f2b84b;" onclick="window.speakItalian('${content.greeting.it.replace(/'/g, "\\'")}')">🔊 Escuchar</span>
          <span>Presentación:</span>
        </div>
        <div style="font-size: 15px; line-height: 1.5; color: #f8f1df;">
          "${escapeHtml(content.greeting.it)}"
        </div>
        <div class="translation-line${vocabVisibleClass}" style="margin-top: 5px; font-style: italic; color: #a69886; font-size: 14px;">
          "${escapeHtml(content.greeting.es)}"
        </div>
      </div>
    `;

    // 2. Vocabulario de Misión
    html += `
      <div style="margin-bottom: 10px; font-weight: bold; color: #f2b84b; font-size: 14.5px;">Vocabolario della missione:</div>
      <div style="max-height: 150px; overflow-y: auto; margin-bottom: 15px; padding-right: 5px;">
    `;
    
    content.vocab.forEach(v => {
      html += `<div style="margin-bottom: 8px; font-size: 15px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;"><span style="color: #4cd964; font-weight: bold; cursor: pointer; background: rgba(76, 217, 100, 0.15); padding: 4px 10px; border-radius: 6px; font-size: 13.5px;" onclick="window.speakItalian('${v.it.replace(/'/g, "\\'")}')">🔊 ${escapeHtml(v.it)}</span><span class="translation-line${vocabVisibleClass}" style="margin-top: 0;">— ${escapeHtml(v.es)}</span></div>`;

      const key = v.it.toLowerCase();
      if (!state.vocabTracking[key]) {
        state.vocabTracking[key] = {
          it: v.it,
          es: v.es,
          attempts: 0,
          corrects: 0,
          lastSeen: Date.now(),
          interval: 1,
          nextReview: Date.now()
        };
      }
    });
    html += `</div>`;
    dialogueText.innerHTML = html;

    optionsContainer.innerHTML = "";
    const beginBtn = document.createElement("button");
    beginBtn.className = "dialogue-option";
    beginBtn.style.opacity = "1";
    beginBtn.style.animation = "none";
    beginBtn.dataset.dialogueAction = "begin-mission";
    beginBtn.innerHTML = `<span class="option-marker">↵</span><span class="option-text" style="font-weight: 700; color: #f2b84b;">Comenzar misión</span>`;
    beginBtn.onclick = () => {
      state.vocabSeen = true;
      state.inVocabPhase = false;
      showDialogueStep();
    };
    optionsContainer.appendChild(beginBtn);
    
    // Autoplay ONLY greeting
    queueCurrentInteractionAudio([content.greeting.it]);
  } else {
    showDialogueStep();
  }
}

function showDialogueStep() {
  const mission = state.activeMission;
  const content = state.activeMissionContent || getMissionContent(mission, getMissionLevel(mission));
  const step = content.dialogue[state.dialogueTurn];

  const dialogueText = document.getElementById("dialogue-text");
  const optionsContainer = document.getElementById("dialogue-options");
  const feedbackPanel = document.getElementById("dialogue-feedback");
  const speakFeedbackBtn = document.getElementById("speakFeedbackBtn");
  const translateFeedbackBtn = document.getElementById("translateFeedbackBtn");

  feedbackPanel.style.display = "none";
  if (speakFeedbackBtn) speakFeedbackBtn.style.display = "none";
  if (translateFeedbackBtn) translateFeedbackBtn.style.display = "none";

  const speakDialogueBtn = document.getElementById("speakDialogueBtn");
  if (speakDialogueBtn) {
    speakDialogueBtn.style.display = "flex";
    speakDialogueBtn.onclick = () => {
      window.speakItalian(fillPlayerName(step.prompt));
    };
  }

  const translateDialogueBtn = document.getElementById("translateDialogueBtn");
  if (translateDialogueBtn) {
    translateDialogueBtn.style.display = "inline-flex";
    translateDialogueBtn.classList.toggle("active", dialogueTranslationsVisible);
    translateDialogueBtn.setAttribute("aria-pressed", dialogueTranslationsVisible ? "true" : "false");
    translateDialogueBtn.onclick = () => setTranslationsVisible(!dialogueTranslationsVisible);
  }

  optionsContainer.innerHTML = "";
  const displayChoices = getDisplayChoices(mission, step);
  dialogueText.innerHTML = `${escapeHtml(fillPlayerName(step.prompt))}${translationHtml(step.prompt, { kind: "prompt", step, mission })}`;
  currentInteractionAudioTexts = [fillPlayerName(step.prompt), ...displayChoices.map(choice => fillPlayerName(choice.text))];
  setupDialogueHeaderTools();

  displayChoices.forEach((choice, index) => {
    const choiceText = fillPlayerName(choice.text);
    const btn = document.createElement("button");
    btn.className = "dialogue-option";
    const choiceKey = String.fromCharCode(65 + index);
    btn.dataset.dialogueChoiceKey = choiceKey.toLowerCase();
    btn.innerHTML = `<span class="option-marker">${choiceKey}</span>
                     <span class="option-text"><span>${escapeHtml(choiceText)}</span>${translationHtml(choice.text, { kind: "choice", step, mission })}</span>
                     <button type="button" class="translate-option-btn" title="Mostrar traducción">ES</button>
                     <button type="button" class="speak-option-btn" title="Escuchar">🔊</button>`;
    
    btn.onclick = (e) => {
      if (e.target.closest(".speak-option-btn") || e.target.closest(".translate-option-btn")) return;
      if (feedbackPanel.style.display !== "block") {
        answerMission(choice.originalIndex);
      }
    };

    const translateBtn = btn.querySelector(".translate-option-btn");
    if (translateBtn) {
      translateBtn.classList.toggle("active", dialogueTranslationsVisible);
      translateBtn.setAttribute("aria-pressed", dialogueTranslationsVisible ? "true" : "false");
      translateBtn.onclick = (e) => {
        e.stopPropagation();
        toggleTranslationNear(translateBtn, ".dialogue-option");
      };
    }

    const speakBtn = btn.querySelector(".speak-option-btn");
    if (speakBtn) {
      speakBtn.onclick = (e) => {
        e.stopPropagation();
        window.speakItalian(choiceText);
      };
      speakBtn.onmouseover = () => { speakBtn.style.opacity = "1"; };
      speakBtn.onmouseout = () => { speakBtn.style.opacity = "0.7"; };
    }

    optionsContainer.appendChild(btn);
  });

  queueCurrentInteractionAudio();
}

function answerMission(choiceIndex) {
  const mission = state.activeMission;
  const content = state.activeMissionContent || getMissionContent(mission, getMissionLevel(mission));
  const step = content.dialogue[state.dialogueTurn];
  const isCorrect = choiceIndex === step.correct;

  const feedbackPanel = document.getElementById("dialogue-feedback");
  const feedbackStatus = document.getElementById("dialogue-feedback-status");
  const feedbackTitle = document.getElementById("dialogue-feedback-title");
  const explanationText = document.getElementById("dialogue-explanation");
  const nextBtn = document.getElementById("dialogue-next-btn");
  const translateFeedbackBtn = document.getElementById("translateFeedbackBtn");

  const levelKey = mission.level || "A1";
  if (!state.learningMetrics[levelKey]) {
    state.learningMetrics[levelKey] = { correct: 0, wrong: 0, time: 0, bySkill: {}, byType: {} };
  }
  state.learningMetrics[levelKey].bySkill = state.learningMetrics[levelKey].bySkill || {};
  state.learningMetrics[levelKey].byType = state.learningMetrics[levelKey].byType || {};
  if (mission.skill) state.learningMetrics[levelKey].bySkill[mission.skill] = (state.learningMetrics[levelKey].bySkill[mission.skill] || 0) + 1;

  if (content.vocab) {
    content.vocab.forEach(v => {
      const key = v.it.toLowerCase();
      if (state.vocabTracking[key]) {
        state.vocabTracking[key].attempts++;
        state.vocabTracking[key].lastSeen = Date.now();
        if (isCorrect) {
          state.vocabTracking[key].corrects++;
          state.vocabTracking[key].interval = (state.vocabTracking[key].interval || 1) * 2;
        } else {
          state.vocabTracking[key].interval = 1;
        }
        state.vocabTracking[key].nextReview = Date.now() + state.vocabTracking[key].interval * 24 * 60 * 60 * 1000;
      }
    });
  }

  if (isCorrect) {
    state.streak++;
    state.learningMetrics[levelKey].correct++;
    if (typeof sfxCorrect === "function") sfxCorrect();

    feedbackPanel.className = "dialogue-feedback success";
    feedbackStatus.className = "feedback-status success";
    feedbackTitle.textContent = "¡Correcto!";

    const nextTurn = state.dialogueTurn + 1;
    if (nextTurn < content.dialogue.length) {
      state.dialogueTurn = nextTurn;
      currentInteractionAudioTexts = [fillPlayerName(step.successLine)];
      explanationText.innerHTML = `<div class="feedback-summary">
        <p class="feedback-summary-row">${step.explanation}</p>
        <p class="feedback-summary-row"><span style="color: #4cd964;">${escapeHtml(fillPlayerName(step.successLine))}</span>${translationHtml(step.successLine, { kind: "feedback", step, mission })}</p>
      </div>`;
      
      const speakFeedbackBtn = document.getElementById("speakFeedbackBtn");
      if (speakFeedbackBtn) {
        speakFeedbackBtn.style.display = "flex";
        speakFeedbackBtn.onclick = () => {
          window.speakItalian(fillPlayerName(step.successLine));
        };
      }
      if (translateFeedbackBtn) {
        translateFeedbackBtn.style.display = "inline-flex";
        translateFeedbackBtn.classList.toggle("active", dialogueTranslationsVisible);
        translateFeedbackBtn.setAttribute("aria-pressed", dialogueTranslationsVisible ? "true" : "false");
        translateFeedbackBtn.onclick = () => toggleTranslationNear(translateFeedbackBtn, "#dialogue-feedback");
      }

      nextBtn.onclick = () => {
        showDialogueStep();
      };
    } else {
      let pts = content.reward?.points || 15;
      if (state.activeEffects.doublePoints) { pts *= 2; state.activeEffects.doublePoints = false; }
      state.score += pts;
      state.energy = Math.min(100, state.energy + 8);
      
      // Subida de Nivel de Misión al completar con éxito (B1)
      const currentLvl = getMissionLevel(mission);
      const maxLvl = maxAuthoredLevel(mission);
      state.missionLevels[mission.id] = Math.min(currentLvl + 1, maxLvl);
      state.completed[mission.id] = true;
      window.saveState(); // Guardar el estado tras completar

      let rewardHtml = `<strong>${content.success}</strong><br><br>+${pts} Puntos, +8 Energía.`;
      if (content.reward && content.reward.name) {
        const rid = content.reward.name.toLowerCase().replace(/\s+/g, "");
        if (rewardEffects[rid]) {
          rewardEffects[rid].apply();
          rewardHtml += `<br><span style="color: #4cd964;">🎁 ${rewardEffects[rid].desc}</span>`;
        }
      }
      explanationText.innerHTML = rewardHtml;
      currentInteractionAudioTexts = [fillPlayerName(content.success)];
      
      const speakFeedbackBtn = document.getElementById("speakFeedbackBtn");
      if (speakFeedbackBtn) speakFeedbackBtn.style.display = "none";
      if (translateFeedbackBtn) translateFeedbackBtn.style.display = "none";

      nextBtn.onclick = () => {
        closeDialogue();
      };
    }
  } else {
    if (state.activeEffects.streakProtect) {
      state.streak = state.streak;
      state.activeEffects.streakProtect = false;
    } else {
      state.streak = 0;
    }
    state.learningMetrics[levelKey].wrong++;
    const errType = mission.errorTypes ? mission.errorTypes[choiceIndex % mission.errorTypes.length] : "unknown";
    state.learningMetrics[levelKey].byType[errType] = (state.learningMetrics[levelKey].byType[errType] || 0) + 1;
    state.energy = Math.max(0, state.energy - 15);
    if (typeof sfxWrong === "function") sfxWrong();

    feedbackPanel.className = "dialogue-feedback error";
    feedbackStatus.className = "feedback-status error";
    feedbackTitle.textContent = "¡Incorrecto!";

    if (mission.failEvent === "badFood" || mission.failEvent === "awkward") {
      state.activeEffects.dizzy = Date.now() + 15 * 1000;
    }

    state.dialogueTurn = 0;

    const diagnosisText = getDiagnosisText(mission, choiceIndex);
    currentInteractionAudioTexts = [fillPlayerName(step.failureLine)];
    explanationText.innerHTML = `<div class="feedback-summary">
      <p class="feedback-summary-row"><strong>Correcta:</strong> ${escapeHtml(fillPlayerName(step.choices[step.correct]))}.</p>
      <p class="feedback-summary-row">${step.explanation}</p>
      ${diagnosisText ? `<p class="feedback-note"><strong style="color:#f2b84b;">Diagnóstico:</strong> ${diagnosisText}</p>` : ""}
      <p class="feedback-summary-row"><span style="color: #ff3b30;">${escapeHtml(fillPlayerName(step.failureLine))}</span>${translationHtml(step.failureLine, { kind: "feedback", step, mission })}</p>
      <p class="feedback-note">Energía: -15. Se reinicia desde el inicio.</p>
    </div>`;

    const speakFeedbackBtn = document.getElementById("speakFeedbackBtn");
    if (speakFeedbackBtn) {
      speakFeedbackBtn.style.display = "flex";
      speakFeedbackBtn.onclick = () => {
        window.speakItalian(fillPlayerName(step.failureLine));
      };
    }
    if (translateFeedbackBtn) {
      translateFeedbackBtn.style.display = "inline-flex";
      translateFeedbackBtn.classList.toggle("active", dialogueTranslationsVisible);
      translateFeedbackBtn.setAttribute("aria-pressed", dialogueTranslationsVisible ? "true" : "false");
      translateFeedbackBtn.onclick = () => toggleTranslationNear(translateFeedbackBtn, "#dialogue-feedback");
    }

    nextBtn.onclick = () => {
      closeDialogue();
    };
  }

  saveState();
  updateGameHUD();
  setupDialogueHeaderTools();
  setTranslationsVisible(dialogueTranslationsVisible);
  feedbackPanel.style.display = "block";
  queueCurrentInteractionAudio();
}

function closeDialogue() {
  const panel = document.getElementById("dialogue-panel");
  if (panel) {
    panel.style.display = "none";
  }
  if (dialogueAutoSpeechTimer) clearTimeout(dialogueAutoSpeechTimer);
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch(e) {}
  if (typeof window.setMusicDucked === "function") window.setMusicDucked(false);
  state.inDialogue = false;
  state.activeMission = null;
  state.dialogueTurn = 0;
  state.vocabSeen = false;
  state.inVocabPhase = false;

  const speakDialogueBtn = document.getElementById("speakDialogueBtn");
  if (speakDialogueBtn) speakDialogueBtn.style.display = "none";
  const translateDialogueBtn = document.getElementById("translateDialogueBtn");
  if (translateDialogueBtn) translateDialogueBtn.style.display = "none";
  const speakFeedbackBtn = document.getElementById("speakFeedbackBtn");
  if (speakFeedbackBtn) speakFeedbackBtn.style.display = "none";
  const translateFeedbackBtn = document.getElementById("translateFeedbackBtn");
  if (translateFeedbackBtn) translateFeedbackBtn.style.display = "none";

  saveState();
  updateGameHUD();
}

document.addEventListener("keydown", handleDialogueShortcuts);

// Regla F1: el panel de diálogo (misión, bienvenida y perfil inicial reusan el
// mismo #dialogue-panel + state.inDialogue) se registra una única vez en el
// gestor global de Esc. Su close-fn no hace nada si el panel no está abierto.
if (typeof window.registerModal === "function") {
  window.registerModal("dialogue", () => { if (state.inDialogue) closeDialogue(); });
}
