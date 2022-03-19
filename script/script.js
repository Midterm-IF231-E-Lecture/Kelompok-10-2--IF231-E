const RENDER = "render-game";
let avatar_pos = 1;
let intervalGame;

let MAKAN = true;
let TIDUR = true;
let MAIN = true;
let BELAJAR = true;
let STATUS = true;

document.addEventListener("DOMContentLoaded", function() {
    $("#section-play").hide();
    $("#nav-left").click(function(){
        if(avatar_pos == 1){
            avatar_pos = 3;
        }else {
            avatar_pos-=1;
        }
        $("#img-avatar").attr("src", `img/avatar/avatar_main${avatar_pos}.png`)
    })
    $("#nav-right").click(function(){
        if(avatar_pos == 3){
            avatar_pos = 1;
        }else {
            avatar_pos+=1;
        }
        $("#img-avatar").attr("src", `img/avatar/avatar_main${avatar_pos}.png`)
    })

    $("#btn-play").click(function(){
        const name = $("#input-name").val();
        if(name.trim().length > 2) {
            localStorage.setItem("isstarted", true);
            localStorage.setItem("name", name);
            localStorage.setItem("myavatar", avatar_pos);
            localStorage.setItem("jam", 0);
            localStorage.setItem("menit", 0);
            localStorage.setItem("makan", 50);
            localStorage.setItem("tidur", 50);
            localStorage.setItem("main", 50);
            localStorage.setItem("belajar", 0);
            localStorage.setItem("semester", 1);
            document.dispatchEvent(new Event(RENDER));
        }else{
            swal("error", "Masukkan Nama Dengan Benar", "error");
        }
    })

    $("#btn-makan").click(function(){
        makeColourButton($("#btn-makan"));
        STATUS = true;
        MAKAN = true;
        MAIN = false;
        BELAJAR = false;
        TIDUR = false;
        let avatar = localStorage.getItem("myavatar");
        $("#img-avatar-play").attr("src", `img/avatar/avatar_${avatar}_eating.png`)
    })
    $("#btn-main").click(function(){
        makeColourButton($("#btn-main"));
        STATUS = true;
        MAKAN = false;
        MAIN = true;
        BELAJAR = false;
        TIDUR = false;
        let avatar = localStorage.getItem("myavatar");
        $("#img-avatar-play").attr("src", `img/avatar/avatar_${avatar}_play.png`)
    })
    $("#btn-tidur").click(function(){
        makeColourButton($("#btn-tidur"));
        STATUS = true;
        MAKAN = false;
        MAIN = false;
        BELAJAR = false;
        TIDUR = true;
        let avatar = localStorage.getItem("myavatar");
        $("#img-avatar-play").attr("src", `img/avatar/avatar_${avatar}_sleep.png`)
    })
    $("#btn-belajar").click(function(){
        makeColourButton($("#btn-belajar"));
        STATUS = true;
        MAKAN = false;
        MAIN = false;
        BELAJAR = true;
        TIDUR = false;
        let avatar = localStorage.getItem("myavatar");
        $("#img-avatar-play").attr("src", `img/avatar/avatar_${avatar}_learn.png`)
    })

    $("#btn-reset").click(function(){
        resetGame();
    });
    document.dispatchEvent(new Event(RENDER));
});

document.addEventListener(RENDER, function() {
    let statusGame = localStorage.getItem("isstarted");
    if(statusGame) {
        $("#section-play").show();
        $("#section-started").hide();
        let name = localStorage.getItem("name");
        let avatar = localStorage.getItem("myavatar");
        $("#name-local").text(name);
        $("#img-avatar-play").attr("src", `img/avatar/avatar_main${avatar}.png`)
        intervalGame = setInterval(initialGame, 1000)
    }else {
        $("#section-play").hide();
        $("#section-started").show();
    }
})

function initialGame(){
    let makan = localStorage.getItem("makan");
    let tidur = localStorage.getItem("tidur");
    let main = localStorage.getItem("main");
    let belajar = localStorage.getItem("belajar");
    let semester = localStorage.getItem("semester");
    let jam = localStorage.getItem("jam");
    let menit = localStorage.getItem("menit");
    $("#semester").text(semester);
    setTime(jam, menit);
    setGreeting(jam);

    let newMenit = parseInt(menit);
    let slip = 0;
    if(newMenit%3 == 0 && newMenit != 0){
        slip = 1;
    }else{
        slip = 1;
    }

    let newMakan = parseInt(makan);
    let newTidur = parseInt(tidur);
    let newMain = parseInt(main);
    let newBelajar = parseInt(belajar);
    console.log(BELAJAR);
    if((newMakan == 10 || newMakan == 5) && BELAJAR){
        $(".warning-limit").html($(".warning-limit").html() + `<div class=" alert alert-warning fade show" role="alert">Heyy makan dulu ingat!! Tidak ada yg menyayangimu</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`)
    }
    if((newTidur == 10 || newTidur == 5) && MAKAN){
        $(".warning-limit").html($(".warning-limit").html() + `<div class=" alert alert-warning fade show" role="alert">Heyy tidur dulu ingat!! Tidak ada yg mencintaimu</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`)
    }
    if((newMain == 10 || newMain == 5) && TIDUR){
        $(".warning-limit").html($(".warning-limit").html() + `<div class=" alert alert-warning fade show" role="alert">Heyy jangan main terus ingat!! kamu itu jomblo</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`)
    }

    if(newMakan <= 0 || newTidur <= 0 || newMain <= 0){
        swal("Game Over!", "Anda Sudah Drop Out", "error")
        MAKAN = false;
        resetGame();
    }
    else if(newMakan >= 100 && STATUS && MAKAN){
        STATUS = false;
        swal("Peringatan!", "Anda Sudah Kenyang", "warning")
        MAKAN = false;
    }else if(newTidur >= 100 && STATUS && TIDUR){
        STATUS = false;
        swal("Peringatan!", "Anda Sudah Selesai Tidur", "warning")
        TIDUR = false;
    }else if(newMain >= 100 && STATUS && MAIN){
        STATUS = false;
        swal("Peringatan!", "Anda Terlalu Lama Main", "warning");
        MAIN = false;
    }else if(newBelajar >= 100) {
        let currentSemester = parseInt(localStorage.getItem("semester"));
        if(currentSemester+1 == 9){
            swal("Selamat", "Anda Sudah Lulus", "success");
            resetGame();
        }
        localStorage.setItem("semester", currentSemester+1);
        localStorage.setItem("belajar", 0);
    }else {
        if(MAKAN && MAIN && TIDUR && STATUS){
            setProgressBar($("#progres-food"), newMakan-slip, "makan");
            setProgressBar($("#progres-sleep"), newTidur-slip, "tidur");
            setProgressBar($("#progres-game"), newMain-slip, "main");
            setProgressBar($("#progres-book"), newBelajar, "belajar");
        }else if(MAKAN && newMakan < 100){
            setProgressBar($("#progres-food"), newMakan+slip, "makan");
            setProgressBar($("#progres-sleep"), newTidur-slip, "tidur");
        }else if(TIDUR && newTidur <  100){
            setProgressBar($("#progres-sleep"), newTidur+slip, "tidur");
            setProgressBar($("#progres-game"), newMain-slip, "main");
        }else if(MAIN && newMain < 100){
            setProgressBar($("#progres-game"), newMain+slip, "main");
        }else if(BELAJAR && newBelajar < 100){
            setProgressBar($("#progres-book"), newBelajar+2, "belajar");
            setProgressBar($("#progres-food"), newMakan-slip, "makan");
            setProgressBar($("#progres-sleep"), newTidur-slip, "tidur");
        }
    }
    
}

function setTime(jam, menit){
    let tJam = jam.toString().padStart(2,0);
    let tMenit = menit.toString().padStart(2,0);
    $("#time").text(tJam + ":" + tMenit);
    let newMenit = parseInt(menit)+1
    let newJam = parseInt(jam)+1;
    localStorage.setItem("menit", newMenit);
    if(newMenit == 60) {
        localStorage.setItem("menit", 0);
        localStorage.setItem("jam", newJam);
    }
    if(newJam >= 24){
        localStorage.setItem("jam", 0);
        localStorage.setItem("menit", 0);
    }
}

function setGreeting(jam){
    let greet = "";
    if(jam < 10){
        $("body").css('backgroundImage', `url('img/background/background-pagi.jpeg')`)
        greet = "Morning, ";
    }else if(jam < 18) {
        $("body").css('backgroundImage', `url('img/background/background-siang.jpeg')`)
        greet = "Afternoon, "
    }else {
        $("body").css('backgroundImage', `url('img/background/background-malam.jpeg')`)
        greet = "Night, "
    }
    $("#text-greeting").text(greet);
}

function setProgressBar(view, size, key){
    view.css('width', size+"%");
    view.removeClass("bg-danger bg-warning bg-info bg-success");
    view.text(size + "%");
    if(size < 25) {
        view.addClass("bg-danger");
    }else if(size < 50){
        view.addClass("bg-warning");
    }else if(size < 75){
        view.addClass("bg-info");
    }else if(size >= 75){
        view.addClass("bg-success");
    }
    localStorage.setItem(key, size);
}

function makeColourButton(view){
    $("#btn-makan").addClass("btn-warning");
    $("#btn-main").addClass("btn-warning");
    $("#btn-tidur").addClass("btn-warning");
    $("#btn-belajar").addClass("btn-warning");

    view.removeClass("btn-warning");
    view.addClass("btn-success");
}

function resetGame(){
    $("body").css('backgroundImage', `url('img/background/background-main.jpg')`)
    localStorage.clear();
    avatar_pos = 1;
    clearInterval(intervalGame);
    MAKAN = true;
    TIDUR = true;
    MAIN = true;
    BELAJAR = false;
    STATUS = true;
    $("#btn-makan").addClass("btn-warning");
    $("#btn-main").addClass("btn-warning");
    $("#btn-tidur").addClass("btn-warning");
    $("#btn-belajar").addClass("btn-warning");
    $("#section-play").hide();
    $("#section-started").show();
}
