Follow the following steps to run app in your pc:
1. Make sure you have NodeJs and mongodb installed(make a database named test in mongodb).
2. Clone this repo.
3. Open Terminal in repo directory. Then type following commands in terminal.
```
npm install
npm start
```
4. After this you can start testing api from Postman on port 4000

API Structure
1. http://localhost:4000/signup\
Post request require first_name, last_name, email, password, mobile_no, address. It returns token.

2. http://localhost:4000/signin\
Post request require email and password. It returns token.

3. http://localhost:4000/users\
Get request. Needs Authorization Bearer token. If any query parameter like first_name, email, etc provided will show based on that else all users will be returned. Provide offset and limit for pagination

4. http://localhost:4000/users/:id\
Put request. Needs Authorization Bearer token. Will update user whose id is provided in query parameter.