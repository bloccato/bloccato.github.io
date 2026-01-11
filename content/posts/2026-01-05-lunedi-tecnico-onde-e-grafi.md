---
title: "Lunedì Tecnico - Onde e Grafi"
date: 2026-01-06
category: Tecnico
---

Al momento sto lavorando a un progetto - sia al lavoro che fuori orario - che mi mette alla prova: automatizzare il processo di migrazione di un’applicazione costruita su AngularJS - anzi, una grande applicazione di circa 200 mila righe di codice, al framework React.

Perché? Le nostre applicazioni sono un misto di AngularJS, Angular2 e React. Google ha deprecato AngularJS il 31 dicembre 2021 e quindi adesso AngularJS ci presenta una serie di problemi come i rischi di sicurezza, la conoscenza obsoleta che ci vuole per lavorare con il framework, ecc. È assolutamente il nostro debito tecnico peggiore, ma finora la migrazione necessaria era sia difficile che costosa - soprattutto in termini di costo-opportunità. 

Oggi, però, con gli strumenti d’IA, il processo dovrebbe essere molto più facile. Questa è la mia teoria comunque e ciò che sto cercando adesso di dimostrare. 

Gli strumenti che uso quotidianamente per questo progetto: 

*   Gemini (sull’app) - lavoriamo insieme sulle specifiche. Per iniziare le ho descritto cosa volevo costruire, e perché, e insieme abbiamo fatto la prima specificazione. 
*   VSCode e Claude Sonnet 4.5 - Prendo le istruzioni dalla spec, costruisco un “prompt”, e poi lo do a Claude.

In un altro post in futuro spiegherò l'architettura dato che è troppo complicata per un post infrasettimanale. In breve, il mio progetto è un pipeline autonoma per la produzione di software che combina l’informatica (teoria dei grafi, analisi (dell’AST)), l’intelligenza artificiale (lla generazione di codice tramite LLM) e le migliori pratiche di ingegneria del software (TDD) per risolvere uno dei problemi più costosi nel software aziendale ovvero la modernizzazione del codice legacy. 

Ad oggi ho raggiunto un buon punto nel progetto - il sistema sembra funzionare. Ho trovato un sacco di nuovi problemi oggi - per esempio ho scoperto che l'implementazione era “monomorphic” e deve essere “polymorphic”, ma l’ho sistemato prima. Domani sono sicuro che ne troverò più, ma se posso “decifrare il codice” qui, ci risparmieremo molti anni di lavoro, forse miliardi di dollari e avrò imparato qualcosa di molto importante e prezioso.