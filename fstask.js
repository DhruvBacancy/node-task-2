const fs = require("fs");
const readline = require("readline-sync");
const Table = require("cli-table");
const lodash=require("lodash");

let flag=0;
let trainInfo=[];

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
            console.table(maxTrain)
            break;
        case 2:
            const minTrain = trainData.reduce((min, current) =>
                +current.distance < +min.distance ? current : min
                , trainData[0])
            console.table(minTrain)
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
           case 4:
            const stationNumber1 = []
            for (let i = 0; i < trainData.length; i++) {
                if (i === (trainData.length - 1)) {
                    stationNumber1.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq })
                    break;
                }
                if ((+trainData[i].trainNo) !== (+trainData[i + 1].trainNo)) {
                    stationNumber1.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq })
                }
            }
            stationNumber1.sort((a,b)=>{return b.trainTotalStation - a.trainTotalStation})
            flag1=0; 
            for(i=0;i<stationNumber1.length;i++)
            {
                if(stationNumber1[i+1].trainTotalStation<stationNumber1[i].trainTotalStation)
                {
                    flag1=i+1;
                    break;
                }               
            }
            for(i=stationNumber1.length;i>flag1;i--)
            {
                stationNumber1.pop();
            }
           var table=new Table({
            head: ['Train No','Total Stations Covered']
           }); 
           for(i in stationNumber1)
           {
                table.push([stationNumber1[i].trainNumber,stationNumber1[i].trainTotalStation])
           }
           console.log(table.toString())
            break;
            case 5:
                for(i=0;i<trainData.length;i++)
                {
                    if (i===0)
                    {
                        trainInfo.push({trainNo:trainData[i].trainNo,trainName:trainData[i].trainName})
                    }
                    if(i===trainData.length-1)
                    break;
                    if ((+trainData[i].trainNo) !== (+trainData[i + 1].trainNo))
                    {
                        trainInfo.push({trainNo:trainData[i].trainNo,trainName:trainData[i].trainName})
                    }
                }
                var table=new Table({
                    head: ['Train No','Train Name']
                    
                }); 
                for(i in trainInfo)
                {
                    table.push([trainInfo[i].trainNo,trainInfo[i].trainName])
                }
               console.log(table.toString())
                
                break;

                case 6:
                   
                    const groupedData = new Map();
                    const trainGroup=[];
                    trainData.forEach((item) => {
                        if (!groupedData.has(item.trainNo)) {
                          groupedData.set(item.trainNo, []);
                        }
                        groupedData.get(item.trainNo).push(item);
                      });
                      for (const t of groupedData) {
                        trainGroup.push(t);
                      }
                    
                    console.log("Enter starting station name or code:")
                    let source=String(readline.question());
                    console.log("Enter Destination station name or code:")
                    let destination=String(readline.question());

                    
                    flag = 0;
                    if (source || destination !== null) {
                        source = source.toUpperCase();
                        destination = destination.toUpperCase();
                  
                        console.log(" ");
                        console.log("Trains Between", source, destination);
                        console.log(" ");
                        for (let i = 0; i < trainGroup.length; i++) {
                            for (let j = 0; j < trainGroup[i].length; j++) {
                              for (const x of trainGroup[i][j]) {
                                if (
                                  x.stationName != undefined &&
                                  x.destinationStationName != undefined
                                ) {
                                  if (
                                    x.stationName == source || x.stationCode == source &&
                                    x.destinationStationName.trim() == destination || x.destinationStationCode.trim() == destination
                                     ) {
                                      trainInfo.push(x);
                                    } else {
                                    flag = flag + 1;
                                  }
                                }
                              }
                            }
                          }
                          if (trainInfo.length != 0) {
                            flag = 0;
                          }
                    
                          if (flag > 0) {
                            console.error("No Trains Found for the Mentioned Route");
                            console.log(" ");
                          } else {
                            console.table(trainInfo);
                          }
                        } else {
                          console.log(" ");
                          console.error("USER ERROR - Enter Valid Station Names");
                          console.log(" ");
                        }
                    
                    

                        break;
                        
                default:
            console.log("Wrong Choice!!Try again")
            break;
        }
        
        

})


//     "trainNo",
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

// console.log(maxTrain1)

// for (const train of trainData) {
    //Max distance for loop logic;
    //     if (+train.distance > maxTrain1) {
    //         maxTrain1 = +train.distance
    //     }
    // }


            // const k=0;
            
            // for(i=0;i<trainData.length;i++)
            // {

            //     if ((+trainData[i].trainNo) === (+trainData[i + 1].trainNo))
            //     {
            //         do
            //         if(trainData[i].sourceStationCode===startStation || trainData[i].sourceStationName===startStation)
            //         {
                        
            //         }
            //     }
            // }
// for(i of trains)
// {
//     if(trains[i].)
// }