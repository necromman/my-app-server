var express = require('express');
const crypto = require('crypto');
var router = express.Router();
const jwt = require('jsonwebtoken');
const maria = require('../database/connect/maria');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '인덱스랍니다.' });
  //res.send('Hello World!');
});

router.get('/login', function(req, res, next) {
    res.render('index', { title: '로그인 페이지' });
    //res.send('Hello World!');
});

router.get('/signup', function(req, res, next) {
    res.render('index', { title: '가입 페이지' });
    //res.send('Hello World!');
});

router.post('/signupProcess', (req, res) => {
    // Get the basic information from the request body
    console.log(req.body)
    const { name, email, password } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    // Derive a key using the PBKDF2 algorithm
    const key = crypto.pbkdf2Sync(password, salt, 10000, 128, 'sha512');
    // Convert the key to a hex string
    const hashedPassword = key.toString('hex');
 
    maria.query('INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, salt],
    (error, results) => {
    if (error) {
        // 쿼리 실패시 에러 응답
        res.status(500).send(error);
    } else {
        // 쿼리 성공시 결과 응답
        //res.render('index', { title: results[0].username });
        res.send(results);
    }
    });
  });
  

router.post('/loginProcess', (req, res) => {
    // Get the username and password from the request body
    const { email, password } = req.body;

    maria.query('SELECT * FROM users WHERE email = ?',[email], function(err, rows, fields) {
        if(err) {
            console.log("err : " + err);
            res.send(err);  // response send err
        }      
        // Get the salt and hashed password from the database
        const { username, salt, password: hashedPassword } = rows[0];

        // Derive a key using the PBKDF2 algorithm
        const key = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

        // Convert the key to a hex string
        const enteredHashedPassword = key.toString('hex');

        // Compare the entered hashed password with the hashed password
        if (enteredHashedPassword !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
        }

        // If the password is correct, create a JWT
        const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });

        // Send the JWT in the response
        res.json({ token });
    });
});

router.get('/users',verifyToken, (req, res) => {
    // MySQL에서 사용자 목록을 가져옵니다.
    maria.query('SELECT * FROM users', (error, results) => {
      if (error) {
        // 쿼리 실패시 에러 응답
        res.status(500).send(error);
      } else {
        // 쿼리 성공시 결과 응답
        //res.render('index', { title: results[0].username });
        res.send(results[0].username);
      }
    });
  });


  router.post('/getRequestParameter', (req, res) => {
    // Proworks request parameter
    console.log(req.body);
    const { xdaName } = req.body.data;

    maria.query("SELECT * FROM sysla03 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID like ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision",
    [xdaName],
    (err, rows, fields) => {
    if (err) {
        // 쿼리 실패시 에러 응답
        console.log(err);
        res.status(500).send(err);
    } else {
        // 쿼리 성공시 결과 응답
        //res.render('index', { title: results[0].username });
        res.send(rows);
    }
    });
  });

  router.post('/getResponseParameter', (req, res) => {
    // Proworks request parameter
    console.log(req.body);
    const { xdaName } = req.body.data;

    maria.query("SELECT * FROM sysla04 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID like ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision",
    [xdaName],
    (err, rows, fields) => {
    if (err) {
        // 쿼리 실패시 에러 응답
        console.log(err);
        res.status(500).send(err);
    } else {
        // 쿼리 성공시 결과 응답
        //res.render('index', { title: results[0].username });
        res.send(rows);
    }
    });
  });

router.get('/create', function(req, res) {
  maria.query('CREATE TABLE DEPARTMENT ('
	+'DEPART_CODE INT(11) NOT NULL,'
	+'NAME VARCHAR(200) NULL DEFAULT NULL COLLATE utf8mb3_general_ci,'
	+'PRIMARY KEY (DEPART_CODE) USING BTREE)', function(err, rows, fields) {
    if(!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/drop', function(req, res) {
  maria.query('DROP TABLE DEPARTMENT', function(err, rows, fields) {
    if(!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/insert', function(req, res) {
  maria.query('INSERT INTO DEPARTMENT(DEPART_CODE,NAME) VALUES(5001,"ENGLISH")', function(err, rows, fields) {
    if(!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/select', function(req, res) {
  maria.query('SELECT * FROM DEPARTMENT', function(err, rows, fields) {
    if(!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/update', function(req, res) {
  maria.query('UPDATE DEPARTMENT SET NAME="UPD ENG" WHERE DEPART_CODE=5001', function(err, rows, fields) {
    if(!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/delete', function(req, res) {
  maria.query('DELETE FROM DEPARTMENT WHERE DEPART_CODE=5001', function(err, rows, fields) {
    if(!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});


function verifyToken(req, res, next) {
    // Get the JWT from the request header
    const token = req.headers.authorization;
  
    // If the JWT is not provided, return an error
    if (!token) {
        return res.redirect('/login');
      //return res.status(401).json({ error: 'No token provided' });
    }
  
    // Verify the JWT
    jwt.verify(token, 'secret', (error, decoded) => {
      if (error) {
        return res.redirect('/login');
        //return res.status(401).json({ error: 'Invalid token' });
      }
  
      // If the JWT is valid, save the decoded token to the request object
      req.decoded = decoded;
      // Call the next middleware function
      next();
    });
  }

module.exports = router;