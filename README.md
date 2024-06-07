## STRESSFULapi
### Team members
frans.budiman@mail.utoronto.ca  
mario.liao@mail.utoronto.ca  
pantysh.ghurburrun@mail.utoronto.ca 
### Description
The proposal of our web application is to create a Japanese writing app, where new Japanese learners can learn how to write the Japanese alphabet (Hiragana and Katakana). Our app will be deployed via mobile, allowing the user to easily write with their fingers. When the user is practising or learning a Japanese character, our app will give the user feedback, to whether or not they have done the correct stroke order, the generally correct stroke, and the position of the start of the stroke. Along with users being able to “learn” and “review” Japanese characters, we will have an additional feature when users can play a game. This game will be a 1 vs 1 game, where the app will score the users based on their speed of writing and how correct their writing is.
### Required Elements
- Frontend: Angular  
- Backend: Express  
- Database: postgreSQL  
- Third-party API:   
    - https://wicg.github.io/handwriting-recognition/  
    - https://developers.google.com/ml-kit/vision/digital-ink-recognition   
    - https://kanjiapi.dev/  
- OAuth 2.0
### Additional Requirements
#### Webhook 
- Use Discord webhook to send messages to a discord channel
    - Game session notification
    - Game final winner with stats
#### Real-time
- Users can compete with other users online to see who can write the characters of a sentence the fastest.
- Use web sockets to establish a 2-way communication that way users can see the progress of their “opponent”.
- For example: Opponent successfully writes a character → Sends HTTP request to notify server for completion → Server uses web sockets to notify other players/you that the opponent finished that particular character or won the game.
### Alpha Milestones
- Frontend/backend setup 
- User auth setup with OAuth 2.0
- Basic UI
- Start implementing 2-way communication using web sockets
- Implement the Japanese alphabet (hiragana and katakana) and their images/stroke order images into our app
- Research and implement how to be able to detect stroke order and handwriting
### Beta Milestones
- Deployment with public URL
- Implementation of 2 way communication for real-time game mode
- Combine the stroke order and handwriting detection with the Japanese alphabet (hiragana and katakana)
- Feedback mechanism for character writing
### Final Milestones
- Full implementation of all features
    - Detailed feedback for stroke order, correctness, and starting position
    - 1V1 gamemode with a scoring system based on speed and accuracy
    - etc
- Final Deployment
