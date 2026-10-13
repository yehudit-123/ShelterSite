const fs = require("fs");
const conDB = require("./ConnectToDB");

async function insertShelters() {

    const shelters = JSON.parse(
        fs.readFileSync("./sheltersCoordinates.json", "utf8")
    );

    for (const shelter of shelters) {

        await conDB.promise().query(
            `
            INSERT INTO shelters
            (
                shelterName,
                address,
                latitude,
                longitude,
                type,
                createdByUserId,
                status,
                likesCount
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                `מיגונית ${shelter.address}`,
                shelter.address,
                shelter.latitude,
                shelter.longitude,
                "migunit",
                1,
                "approved",
                0
            ]
        );

        console.log(`Inserted: ${shelter.address}`);
    }

    console.log("All shelters inserted!");
}

insertShelters();
// const conDB = require("./ConnectToDB");
// require("dotenv").config();
// const { getCoordinates } = require("../services/GeocodingService");

// const fs = require("fs");
// const conDB = require("./ConnectToDB");

// async function insertShelters() {

//     const shelters = JSON.parse(
//         fs.readFileSync("./sheltersCoordinates.json", "utf8")
//     );

//     for (const shelter of shelters) {

//         await conDB.promise().query(
//             `
//             INSERT INTO shelters
//             (address, latitude, longitude)
//             VALUES (?, ?, ?)
//             `,
//             [
//                 shelter.address,
//                 shelter.lat,
//                 shelter.lng
//             ]
//         );

//         console.log(`Inserted: ${shelter.address}`);
//     }

//     console.log("DONE");
// }

// insertShelters();

async function runQuery(query) {
    return await conDB.promise().query(query);
}

async function initializeDB() {
    try {
        await runQuery(`INSERT INTO Messages
        (senderUserId, senderName, senderEmail, subject, messageText, adminResponse, status)
        VALUES
        
        (1,'משה','moshe@gmail.com','מיגונית חסומה','המיגונית ברחוב הרצל חסומה ברכב.',NULL,'pending'),
        
        (2,'שרה','sara@gmail.com','טעות בכתובת','הכתובת של המיגונית אינה מדויקת.','תודה על הדיווח, הכתובת עודכנה.','answered'),
        
        (NULL,'אורח','guest1@gmail.com','בקשת מידע','האם קיימת מיגונית ליד תחנת הרכבת?',NULL,'pending'),
        
        (4,'יעל','yael@gmail.com','בעיה בשילוט','לא מצאתי שילוט למיגונית באזור.','הנושא הועבר לבדיקה.','answered'),
        
        (5,'דוד','david@gmail.com','דלת תקולה','דלת המיגונית אינה נסגרת כראוי.',NULL,'pending'),
        
        (NULL,'אורח','guest2@gmail.com','שאלה כללית','איך אפשר לדווח על מיגונית חדשה?',NULL,'pending'),
        
        (7,'רחל','rachel@gmail.com','מיגונית נעולה','המיגונית הייתה נעולה כשהגעתי.',NULL,'pending'),
        
        (8,'מאיר','meir@gmail.com','ניקיון','המיגונית זקוקה לניקיון.','הועבר לצוות התחזוקה.','answered'),
        
        (9,'נעמי','naomi@gmail.com','תאורה','אין תאורה בתוך המיגונית.',NULL,'pending'),
        
        (10,'יהושע','yehoshua@gmail.com','כתובת שגויה','הכתובת במערכת לא נכונה.','המידע עודכן במערכת.','answered'),
        
        (NULL,'אורח','guest3@gmail.com','בקשה להוספה','אשמח להוסיף מיגונית חדשה למאגר.',NULL,'pending'),

        (12,'חנה','hana@gmail.com','גישה למיגונית','הגישה למיגונית חסומה.',NULL,'pending'),
        
        (13,'שמואל','shmuel@gmail.com','בעיה במפה','המיקום במפה אינו מדויק.','תודה, הנושא טופל.','answered'),
        
        (14,'אסתר','ester@gmail.com','מיגונית פגומה','קיים נזק בקיר המיגונית.',NULL,'pending'),
        
        (15,'אליהו','eliyahu@gmail.com','הצעת שיפור','כדאי להוסיף תמונות למיגוניות.','ההצעה נשקלת.','answered'),
        
        (NULL,'אורח','guest4@gmail.com','שאלה','כמה מיגוניות קיימות בעיר?',NULL,'pending'),
        
        (17,'יצחק','itzhak@gmail.com','תחזוקה','המיגונית דורשת תחזוקה.',NULL,'pending'),
        
        (18,'לאה','lea@gmail.com','בעיה בדיווח','לא הצלחתי לשלוח דיווח.','הבעיה תוקנה.','answered'),
        
        (19,'אביגיל','avigail@gmail.com','מיגונית לא קיימת','המיגונית שמופיעה במערכת לא קיימת.',NULL,'pending'),
        
        (20,'בנימין','binyamin@gmail.com','תודה','רציתי להודות על המערכת.','שמחים לשמוע, תודה!','answered')`);

        console.log("messages table inserted");

//         //     // ======================
//         //     // 👤 USERS
//         //     // ======================
            await runQuery(`
            INSERT INTO users(userName, email, phone, userRole)
            VALUES
            ('Yehudit', 'yehudit@gmail.com', '0523456789', 'admin'),
            ('Hodaya', 'hodaya@gmail.com', '0549876543', 'admin'),
            ('Moshe', 'moshe@gmail.com', '0531122334', 'user'),
            ('Rachel', 'rachel@gmail.com', '0505566778', 'user'),
            ('Maor', 'maor@gmail.com', '0582233445', 'user');
            `);

            console.log("users inserted");

//         //     // ======================
//         //     // 🔐 PASSWORDS
//         //     // ======================
            await runQuery(`
              INSERT INTO passwords (userId, passwordHash)
              VALUES
              (1,11111),
              (2,22222),
              (3,33333),
              (4,44444),
              (5,55555);
            `);

            console.log("passwords inserted");


//         //     // // ======================
//         //     // // 🏠 SHELTERS
//         //     // // ======================

          try {
              for (const address of sheltersAddresses) {
                  await insertShelter(address);
              }

              console.log("DONE - all shelters inserted");
              process.exit();
          } catch (err) {
              console.error("Init error:", err);
          }


        //     console.log("shelters inserted");

//         //   //   ======================
//         //   //   💬 REVIEWS
//         //     // ======================
        await runQuery(`

           INSERT INTO Reviews (userId, shelterId, content) VALUES
           -- מיגונית 123
           (1, 123, 'המיגונית נקייה ומתוחזקת היטב, יש מקום להרבה אנשים.'),
           (2, 123, 'אין כאן תאורת חירום וזה קצת מפחיד בלילה. כדאי לתקן.'),
           (7, 123, 'המקום נגיש לכיסאות גלגלים, שזה מצוין!'),
           (4, 123, 'הדלת הראשית קצת קשה לפתיחה, צריך לשמן את הצירים.'),
           (5, 123, 'מיקום מעולה ממש במרכז הציבורי.'),

           -- מיגונית 124
           (6, 124, 'יש כאן ריח חזק של טחב, דרוש אוורור דחוף.'),
           (7, 124, 'הגענו לכאן בזמן האזעקה והיה מרחב מוגן ובטוח.'),
           (8, 124, 'השאירו פה בקבוקי מים סגורים וערכת עזרה ראשונה, כל הכבוד לתושבים!'),
           (1, 124, 'מלוכלך מאוד, חבל שלא שומרים על הניקיון.'),
           (2, 124, 'המקום מרווח מאוד ונותן תחושת ביטחון.'),

           -- מיגונית 125
           (1, 125, 'השלט שמפנה למיגונית מהרחוב הראשי נפל, קשה למצוא אותה.'),
           (4, 125, 'מקום מצוין, מתוחזק על ידי העירייה באופן קבוע.'),
           (5, 125, 'אין קליטה סלולרית בכלל בפנים, כדאי לבדוק פתרון.'),
           (6, 125, 'היינו פה כמה משפחות והיה מקום לכולם.'),
           (7, 125, 'הכול תקין, המזגן/איוורור עובד כמו שצריך.'),

           -- מיגונית 126
           (8, 126, 'המיגונית נעולה! צריך לבקש מהשכן את המפתח, זה לא הגיוני בזמן חירום.'),
           (12, 126, 'אחרי הדיווח פתחו את המיגונית, עכשיו היא פתוחה וזמינה 24/7.'),
           (13, 126, 'יש פה ספסלי ישיבה נוחים, מאוד עוזר לילדים ומבוגרים.'),
           (1, 126, 'צריך לצבוע מחדש את הקירות מבחוץ, יש עליהם גרפיטי.'),
           (4, 126, 'נקייה, מוארת היטב ובטוחה.'),

           -- מיגונית 127
           (5, 127, 'המיקום במפה לא הכי מדויק, היא נמצאת 20 מטר שמאלה ממה שמסומן.'),
           (6, 127, 'הגעתי לנקות אותה היום, עכשיו הכל מצוחצח ומוכן לשימוש.'),
           (7, 127, 'יש נזילת מים קטנה מהתקרה, כדאי שהעירייה תטפל לפני החורף.'),
           (8, 127, 'מרחב מוגן מעולה, קרוב מאוד לגן המשחקים.'),
           (12, 127, 'תודה רבה על האפליקציה הזו, עזר לנו מאוד למצוא מחסה במהירות.');
             `);

        console.log("reviews inserted");

        // // ======================
        // // ❤️ LIKES
        // // ======================
            await runQuery(`
        INSERT INTO likes
        (userId, shelterId)
        VALUES

        (1,  123),   
        (2,  123),    
        (7, 124),    
        (4, 125),    
        (5, 126),    
        (1, 126),    
        (2, 126),    
        (7, 128),    
        (4, 129),   
        (5, 128),    
        (1,130),    
        (2, 140),    
        (7, 150),    
        (4, 160),
        (5,  170);
        `);

            console.log("likes inserted");

            console.log("ALL DATA INITIALIZED SUCCESSFULLY");

            await conDB.end();

    } catch (err) {
        console.error("Error initializing DB:", err);
    }
}


initializeDB();

module.exports = initializeDB;