var express = require('express');
const crypto = require('crypto');
var router = express.Router();
const jwt = require('jsonwebtoken');
const maria = require('../database/connect/maria');
const { verifyToken } = require('./middlewares');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '인덱스랍니다.' });
  //res.send('Hello World!');
});

router.get('/login', function (req, res, next) {
  res.render('index', { title: '로그인 페이지' });
  //res.send('Hello World!');
});

router.get('/signup', function (req, res, next) {
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

  maria.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows, fields) {
    if (err) {
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

router.get('/validation',  (req, res) => {
  // MySQL에서 사용자 목록을 가져옵니다.
  maria.query('SELECT 1 as result', (error, result) => {
    if (error) {
      // 쿼리 실패시 에러 응답
      res.status(500).send(error);
    } else {
      // 쿼리 성공시 결과 응답
      //res.render('index', { title: results[0].username });
      res.send(result[0]);
    }
  });
});


router.post('/getSQueryText', (req, res) => {
  // Proworks request parameter
  console.log(req.body);
  const { xdaName } = req.body.data;
  maria.query(`
  SELECT * FROM SYSLA02 a
  JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID = ? GROUP BY sID) b
  ON a.sID = b.sID AND a.nRevision = b.max_revision
  `,
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
        console.log(rows);
      }
    });
});



router.post('/getAllParameter', (req, res) => {
  // Proworks All parameter
  let resAll = []
  let requestParam = []
  let responseParam = []
  console.log(req.body);
  const { xdaName } = req.body.data;

  maria.query(`SELECT * FROM SYSLA03 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID = ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision`,
    [xdaName],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        // res.send(rows);
        rows.forEach((column, index) => {
          requestParam.push(column.sColumnName)
          //resAll.push(column.sColumnName)
        })

        maria.query(`SELECT * FROM SYSLA04 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID = ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision`,
          [xdaName],
          (err, rows, fields) => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              rows.forEach((column, index) => {
                responseParam.push(column.sColumnName)
              })
              //resAll = resAll.filter((item, index) => resAll.indexOf(item) === index);
              resAll.push({
                "req":requestParam,
                "res":responseParam
              })
              res.send(resAll)
            }
          });
      }
    });
});

router.post('/getRequestParameter', (req, res) => {
  // Proworks request parameter
  console.log(req.body);
  const { xdaName } = req.body.data;

  maria.query(`SELECT * FROM SYSLA03 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID like ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision`,
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

router.post('/getXdadetails', (req, res) => {
  // Proworks request parameter
  console.log(req.body);
  const { xdaName } = req.body.data;

  maria.query(`SELECT * FROM SYSLA01 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID = ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision`,
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

  maria.query("SELECT * FROM SYSLA04 a JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID like ? GROUP BY sID) b ON a.sID = b.sID AND a.nRevision = b.max_revision",
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

router.post('/getFolderTreeList', (req, res) => {
  // Proworks request parameter
  console.log(req.body);
  const { pathName } = req.body.data;

  maria.query("SELECT sID, MAX(nRevision) AS max_revision, nReturnType, sXDAName, sUpdateDate, sFileName FROM SYSLA01 WHERE sID like concat(?, '%') GROUP BY sID ORDER BY sID",
    [pathName],
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

//SELECT sID, MAX(nRevision) AS max_revision, nReturnType, sXDAName, sUpdateDate, sFileName FROM SYSLA01 WHERE sID like 'kitech.apr.xda%' GROUP BY sID ORDER BY sID

router.get('/getFolderTree', function (req, res) {
  maria.query('SELECT * FROM SYSLA05', function (err, rows, fields) {
    if (!err) {

      let map = {};
      let treeData = {};

      for(let i = 0; i < rows.length; i++) {
        let data = rows[i];
        if (!data.sFolderName) continue;  // Skip rows without sFolderName
        data.name = data.sFolderName; // Change sFolderName to name
        delete data.sFolderName; // Remove sFolderName
        map[data.nFolderID] = i; 
        rows[i].children = []; 
      }

      for(let i = 0; i < rows.length; i++) {
        let data = rows[i];
        if (!data.name) continue;  // Skip rows without name
        if(data.nUpperID === 0) {
          treeData = data; 
        } else {
          rows[map[data.nUpperID]].children.push(data);
        }
      }

      console.log(treeData);
      res.send(treeData) // responses send rows

    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/create', function (req, res) {
  maria.query('CREATE TABLE DEPARTMENT ('
    + 'DEPART_CODE INT(11) NOT NULL,'
    + 'NAME VARCHAR(200) NULL DEFAULT NULL COLLATE utf8mb3_general_ci,'
    + 'PRIMARY KEY (DEPART_CODE) USING BTREE)', function (err, rows, fields) {
      if (!err) {
        res.send(rows); // responses send rows
      } else {
        console.log("err : " + err);
        res.send(err);  // response send err
      }
    });
});

router.get('/drop', function (req, res) {
  maria.query('DROP TABLE DEPARTMENT', function (err, rows, fields) {
    if (!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/insert', function (req, res) {
  maria.query('INSERT INTO DEPARTMENT(DEPART_CODE,NAME) VALUES(5001,"ENGLISH")', function (err, rows, fields) {
    if (!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/select', function (req, res) {
  maria.query('SELECT * FROM DEPARTMENT', function (err, rows, fields) {
    if (!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/update', function (req, res) {
  maria.query('UPDATE DEPARTMENT SET NAME="UPD ENG" WHERE DEPART_CODE=5001', function (err, rows, fields) {
    if (!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});

router.get('/delete', function (req, res) {
  maria.query('DELETE FROM DEPARTMENT WHERE DEPART_CODE=5001', function (err, rows, fields) {
    if (!err) {
      res.send(rows); // responses send rows
    } else {
      console.log("err : " + err);
      res.send(err);  // response send err
    }
  });
});




module.exports = router;