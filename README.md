### Formicaio Macte

Tale microservice e' strutturato al fine di presentate l'opera d'arte conversazionale dell'agent Formicaio sul sito di Macte. 

## GPT Agent

L'agent e' stato progettato usando l'API di LangChain e OpenAI per fornire la migliore esperienza che la nostra opera d'arte mostrera al pubblico. Usando l'architettura RAG (Retriaval Augmented Generation) 

## Infrastruttura

Heroku e' il server utilizzato per rendere live l'applicazione. Inoltre, i documenti usati per l'esecuzione del modello sono immagazinati all'interno di un server di un GDrive. Uno script per la connessione a GCloud e' stato creato per permettere il recupero dei documenti come input del modello. In questo modo, l'Agent di AI raggiunge il risultato sperato.

## Integrazione Web


