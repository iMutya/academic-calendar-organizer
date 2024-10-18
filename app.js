const express = require('express');
const app = express();

// ejs
app.set("views engine", "ejs");
app.use(express.static("public"))

// body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// mysql
const conn = require('./conn.js')



// insert event
app.post('/addevent', (req, res)=> {
    const id = 0;
    const startDate = req.body.startDate;
    const startTime = req.body.startTime;
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;
    const title = req.body.title;
    const description = req.body.description;

    // console.log(${id}, ${startDate},${startTime},${endDate},${endTime},${title},${description});
    
    const sql = `INSERT INTO events VALUES ('${id}','${title}','${description}','${startDate}','${startTime}','${endDate}','${endTime}')`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log('New Record Inserted');
        res.send(`
            <script>
                alert("1 Event Successfully Added!");
                window.location.href="/";
            </script>
            `);
        
    })
})

// insert note
app.post('/addnote',(req, res)=>{
    const id = 0;
    const noteTitle = req.body.noteTitle;
    const noteDescription = req.body.noteDescription;
    const noteLabel = req.body.noteLabel;
    const dueDate = req.body.dueDate;

    const sql = `INSERT INTO notes VALUES ('${id}','${noteTitle}','${noteDescription}','${noteLabel}','${dueDate}')`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log('New Record Inserted');
        res.send(`
            <script>
                alert("1 Note Successfully Added!");
                window.location.href="/";
            </script>
            `);
        
    })
})


// display dashboard events and notes
app.get('/', (req, res) => {
    // Query for events
    const getEvents = `SELECT * FROM events`;
    
    // Query for notes
    const getNotes = `SELECT * FROM notes`;

    // Execute both queries
    conn.query(getEvents, (err, eventData) => {
        if (err) throw err;

        conn.query(getNotes, (err, noteData) => {
            if (err) throw err;

            console.log("Data Displayed Successfully!");
            res.render('index.ejs', {
                title: "ACO",
                action: 'list',
                events: eventData, // Pass events data
                notes: noteData    // Pass notes data
            });
        });
    });
});




// // display dashboard events
// app.get('/', (req, res)=>{
//     // res.render('index.ejs', {title: "My Page"})
//     const getdata = `SELECT * FROM events`;

//     conn.query(getdata,(err,mydata)=>{
//         if(err) throw err;
//         console.log("Data Displayed Successfully!");
//         res.render('index.ejs',{
//             title: "ACO",
//             action: 'list',
//             sampledata:mydata

            
//         });


        
//     })
// })

// display notes
app.get('/noteoptions', (req,res)=>{
    // res.render('noteoptions.ejs', {title: "My Page"})

    const getdata = `SELECT * FROM notes`;

    conn.query(getdata,(err,mydata)=>{
        if(err) throw err;
        console.log("Data Displayed Successfully!");
        res.render('noteoptions.ejs',{
            title: "ACO",
            action: 'list',
            sampledata:mydata

            
        });


        
    })
})

// display
app.get('/eventoptions', (req,res)=>{
    // res.render('eventoptions.ejs', {title: "My Page"})

    const getdata = `SELECT * FROM events`;

    conn.query(getdata,(err,mydata)=>{
        if(err) throw err;
        console.log("Data Displayed Successfully!");
        res.render('eventoptions.ejs',{
            title: "ACO",
            action: 'list',
            sampledata:mydata

            
        });


        
    })
})

// update notes
app.post('/noteoptions/updatenotes/:id', (req, res)=>{
    const upd_id = req.params.id;
    const noteTitle = req.body.noteTitle;
    const noteDescription = req.body.noteDescription;
    const noteLabel = req.body.noteLabel;
    const dueDate = req.body.dueDate;

    const toUpdate = `UPDATE notes SET noteTitle=?,noteDescription= ?,noteLabel=?,dueDate=? WHERE id = ?`;
    conn.query(toUpdate, [noteTitle, noteDescription, noteLabel, dueDate, upd_id], (err, result) => {
        if (err) throw err;
        console.log('New Record Inserted');
        res.send(`
            <script>
                alert("1 Note Successfully Updated!");
                window.location.href="/noteoptions";
            </script>
            `);
        
    })
})

// update event
app.post('/eventoptions/updateevent/:id', (req, res) => {
    const upd_id = req.params.id;
    const startDate = req.body.startDate;
    const startTime = req.body.startTime;
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;
    const title = req.body.title;
    const description = req.body.description;

    const toUpdate = `UPDATE events SET title = ?, description = ?, startDate = ?, startTime = ?, endDate = ?, endTime = ? WHERE id = ?`;

    conn.query(toUpdate, [title, description, startDate, startTime, endDate, endTime, upd_id], (err, result) => {
        if (err) throw err;
        console.log("Data Updated Successfully!");

        res.send(`
            <script>
                alert("Event Updated Successfully!");
                window.location.href="/eventoptions";
            </script>
        `);
    });
});

// delete notes

app.get('/noteoptions/delete/:id',(req, res) => {
    const del_id = req.params.id;
    const toDelete = `DELETE FROM notes WHERE id = "${del_id}"`;
    conn.query(toDelete,(err, result)=>{
        if(err) throw err;
        console.log("Data is Successfully Deleted!");

        res.send(`
            <script>
                alert("Data is Deleted Successfully!");
                window.location.href="/noteoptions";
            </script>
            `)
        

    });
})



// delete

app.get('/eventoptions/delete/:id',(req, res) => {
    const del_id = req.params.id;
    const toDelete = `DELETE FROM events WHERE id = "${del_id}"`;
    conn.query(toDelete,(err, result)=>{
        if(err) throw err;
        console.log("Data is Successfully Deleted!");

        res.send(`
            <script>
                alert("Data is Deleted Successfully!");
                window.location.href="/eventoptions";
            </script>
            `)
        

    });
})


app.get('/login',(req, res)=>{
    res.render('login.ejs');
})

app.post('/login', (req,res)=>{
    const login_email = req.body.login_email;
    const login_password = req.body.login_password;
    const get_login = `SELECT * from users WHERE email = "${login_email}" AND pass = "${login_password}"`;

    conn.query(get_login,(err,result)=>{
        if (err) throw err;
        console.log("Login Successfully");
        res.send(`
            <script>
                alert("Login Successfully! ");
                window.location.href="/";
            </script>
            `)
    })

});

app.get('/register',(req, res)=>{
    res.render('register.ejs');
})

app.post('/signup',(req,res)=>{
    const id = 0;
    const signup_name = req.body.signup_name;
    const signup_email = req.body.signup_email;
    const signup_password = req.body.signup_password;

    const insert_user = `INSERT INTO users VALUES ("${id}","${signup_name}","${signup_email}","${signup_password}") `;

    conn.query(insert_user,(err,result)=>{
        if (err) throw err;
        console.log('Registered Successfully -.-! ');
        res.send(`
            <script>
                alert("Registered Successfully. Congrats, beh! ");
                window.location.href="/login";
            </script>
            `)
    });
    
});



app.listen(3000,(req,res) => {
    console.log("listening at port 3000...");
})