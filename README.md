## STRESSFULapi

### URL
website url: https://stressfulapi.re-v7.tech  
video url: 

### Team members
frans.budiman@mail.utoronto.ca  
mario.liao@mail.utoronto.ca  
pantysh.ghurburrun@mail.utoronto.ca 
### Description
The proposal of our web application is to create a Chinese writing app, where new Chinese learners can learn how to write the Chinese characters. Our app will be deployed via mobile, allowing the user to easily write with their fingers. When the user is practising or learning a Chinese character, our app will give the user feedback, to whether or not they have done the correct stroke order, the generally correct stroke, and the position of the start of the stroke. Along with users being able to “learn” and “review” Chinese characters, we will have an additional feature when users can play a game. This game will be a 1 vs 1 game, where the app will score the users based on their speed of writing and how correct their writing is.
### Required Elements
- Frontend: Angular  
- Backend: Express  
- Database: postgreSQL  
- Third-party API:   
    - https://hanziwriter.org/docs.html
- OAuth 2.0 for user auth/sign-in using social media accounts
### Additional Requirements
#### Webhook 
- Use stripe for payment and its webhook to notify our server
    - Send a webhook to our server when a payment is successful
    - Send a webhook to our server when a payment is unsuccessful
    - etc

#### Real-time Features
- Users can compete with other users online to see who can write the characters of a sentence the fastest.
- Use web sockets to establish a 2-way communication that way users can see the progress of their “opponent”.
- Characters are streamed in real time, and the opponent is notified immediately upon completion of each character.
### Alpha Milestones
- Frontend/backend setup 
- User auth setup with OAuth 2.0
- Basic UI implementation
- Start implementing 2-way communication using web sockets
- Implement the Chinese alphabet and their images/stroke order images into our app
- Research and implement stroke order and handwriting detection
### Beta Milestones
- Deployment with public URL
- Combine the stroke order and handwriting detection with the Chinese alphabet
- Implement feedback mechanism for character writing
### Final Milestones
- Full implementation of all features
    - Detailed feedback for stroke order, correctness, and starting position
    - 1V1 gamemode with a scoring system based on speed and accuracy
    - etc
- Final Deployment
