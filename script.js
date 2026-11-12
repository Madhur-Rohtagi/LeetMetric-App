document.addEventListener("DOMContentLoaded",()=>{

    const searchButton=document.querySelector("#search");
    const usernameInput=document.querySelector("#username");
    
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    
    const statsContainer=document.querySelector(".stats-container");
    statsContainer.style.setProperty("display","none");
    
    const hardLabel=document.querySelector(".hard-label");
    const mediumLabel=document.querySelector(".medium-label");
    const easyLabel=document.querySelector(".easy-label");
    
    const cardStatsContainer=document.querySelector(".stats-card");

    // retrun true or false based on regular expression 
    function validateUserName(username){
        username=username.trim();
        if(username===""){
            alert('User name should not be empty!');
            return false;
        }
        
        const regex=/^[a-zA-Z0-9_-]{1,16}$/;

        if(!regex.test(username)){
            alert("User name is wrong !!");
            return false
        }
        
        return regex.test(username);
    }

    //user detail fetching
    async function fetchUserDetail(username){
        try {
            searchButton.textContent="Searching..";
            searchButton.style.color="white";
            searchButton.disabled=true;

           const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);


            if(!response.ok){
                throw new Error("Unable to fetch User details");
            }
            const data= await response.json();
            console.log(data);
            displayUserData(data);
        } 
        catch (error) {
            statsContainer.style.setProperty("display", "flex");
            statsContainer.style.setProperty("flex-direction", "column");
            document.querySelector(".progress").style.display = "none";
            cardStatsContainer.innerHTML = "<p>Too many requests / No Data found</p>";
        }
        finally{
            searchButton.textContent="Search";
            searchButton.style.color="rgb(56, 56, 70)";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree= (solved*100)/total;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(data){
        document.querySelector(".progress").style.display = "flex";
        statsContainer.style.setProperty("display","flex");
        statsContainer.style.setProperty("flex-direction","column");
        const totalQues=4041;
        const totalHardQues=970;
        const totalEasyQues=962;
        const totalMediumQues=2109;

        const solvedTotalQues=data.acSubmissionNum[0].count;
        const solvedHardQues=data.acSubmissionNum[3].count;
        const solvedEasyQues=data.acSubmissionNum[1].count;
        const solvedMediumQues=data.acSubmissionNum[2].count;

        updateProgress(solvedHardQues,totalHardQues,hardLabel,hardProgressCircle);
        updateProgress(solvedEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);


        //create cards
        const cardsData=[
            {
                label:"Overall Submissions",
                value:data.acSubmissionNum[0].submissions
            },
            {
                label:"Overall Easy Submissions",
                value:data.acSubmissionNum[1].submissions
            },
            {
                label:"Overall Hard Submissions",
                value:data.acSubmissionNum[3].submissions
            },
            {
                label:"Overall Medium Submissions",
                value:data.acSubmissionNum[2].submissions
            },
        ];
        
        console.log(cardsData);

        cardStatsContainer.innerHTML=cardsData.map(
            d =>

                `<div class="card">
                    <h4>${d.label}</h4>
                    <p>${d.value}</p>
                </div>`

         ).join("")
    }

    searchButton.addEventListener("click",()=>{
        const username=usernameInput.value;
        if(validateUserName(username)){
            fetchUserDetail(username);
        }
    })

})