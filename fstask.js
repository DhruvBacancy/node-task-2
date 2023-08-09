const fs = require("fs");
const readline = require("readline-sync");
const Table = require("cli-table");


fs.readFile("./Train_details.csv", "utf8", (err, data) => {
    const routes = data.split('\n').slice(1);
    const trainData = routes.map((route) => {
        const [trainNo,
            trainName,
            seq,
            stationCode,
            stationName,
            arrivalTime,
            departureTime,
            distance,
            sourceStationCode,
            sourceStationName,
            destinationStationCode,
            destinationStationName] = route.split(',');
        return {
            trainNo,
            trainName,
            seq,
            stationCode,
            stationName,
            arrivalTime,
            departureTime,
            distance,
            sourceStationCode,
            sourceStationName,
            destinationStationCode,
            destinationStationName
        }
    })
    console.log("1. Train info with longest route\n2. Train info with shortest route \n3. Train info with which covers less no of station between starting and ending station \n4. Train info with which covers maximum no of station between starting and ending station \n5. No of trains and names of the train\n6. Get the name of pickup point and destination point and provide possible options to travel between.\nEnter choice:");
    const choice = Number(readline.question());

    switch (choice) {
        case 1:
            const maxTrain = trainData.reduce((max, current) =>
                +current.distance > +max.distance ? current : max
                , trainData[0])
            console.log(maxTrain)
            break;
        case 2:
            const minTrain = trainData.reduce((min, current) =>
                +current.distance < +min.distance ? current : min
                , trainData[0])
            console.log(minTrain)
            break;
        case 3:
            const stationNumber = []
            for (let i = 0; i < trainData.length; i++) {
                if (i === (trainData.length - 1)) {
                    stationNumber.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq })
                    break;
                }
                if ((+trainData[i].trainNo) !== (+trainData[i + 1].trainNo)) {
                    stationNumber.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq })
                }
            }
            stationNumber.sort((a,b)=>{return a.trainTotalStation - b.trainTotalStation})
           let flag=0; 
           for(i=0;i<stationNumber.length;i++)
           {
             if(stationNumber[i+1].trainTotalStation>stationNumber[i].trainTotalStation)
             {
                flag=i+1;
                break;
             }               
           }
           for(i=stationNumber.length;i>=flag;i--)
           {
                stationNumber.pop();
           }
           var table=new Table({
            head: ['Train No','Total Stations Covered']
            
           }); 
           for(i in stationNumber)
           {
                table.push([stationNumber[i].trainNumber,stationNumber[i].trainTotalStation])
           }
           console.log(table.toString())
           break;
        default:
            console.log("Wrong Choice!!Try again")
            break;
        }
        
        

})


// "trainNo",
//     "trainName",
//     "seq",
//     "stationCode",
//     "stationName",
//     "arrivalTime",
//     "departureTime",
//     "distance",
//     "sourceStationCode",
//     "sourceStationName",
//     "destinationStationCode",
//     "destinationStationName"


//Sorting for task 3 test

// for (i in stationNumber) {
//     if (i === stationNumber.length - 1) {
//         if (stationNumber[i].trainTotalStation > stationNumber[i - 1].trainTotalStation) {
    //             [stationNumber[i].trainTotalStation, stationNumber[i - 1].trainTotalStation] = [stationNumber[i - 1].trainTotalStation, stationNumber[i].trainTotalStation]

//         }
//         break;
//     }
//     if (stationNumber[i].trainTotalStation > stationNumber[i + 1].trainTotalStation) {
//         [stationNumber[i].trainTotalStation, stationNumber[i + 1].trainTotalStation] = [stationNumber[i + 1].trainTotalStation, stationNumber[i].trainTotalStation]

//     }
//     console.log(stationNumber)
// }
    

// for (const train of trainData) {
    //Max distance for loop logic;
    //     if (+train.distance > maxTrain1) {
    //         maxTrain1 = +train.distance
    //     }
    // }
    // console.log(maxTrain1)