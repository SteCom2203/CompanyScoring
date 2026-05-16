/* ----- NON MODIFIED CODE ---- */
// initialization

const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")



function onHeaderClickOutside(e) {

    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }

}


function toggleHeader() {
    if (isHeaderCollapsed) {
        // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
        collapseHeaderItems.classList.add("opacity-100",)
        collapseHeaderItems.style.width = "60vw"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false

        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)

    } else {
        collapseHeaderItems.classList.remove("opacity-100")
        collapseHeaderItems.style.width = "0vw"
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")
        collapseBtn.classList.add("bi-list")
        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)

    }
}

function responsive() {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.width = ""

    } else {
        isHeaderCollapsed = true
    }
}

window.addEventListener("resize", responsive)


/**
 * Animations
 */

gsap.registerPlugin(ScrollTrigger)


const numberTimeline = gsap.timeline({paused: true, scrollTrigger: {
    trigger: "#numbers",
    start: "100% 100%", // when the top of the trigger hits the top of the viewport
    end: "100% 90%", // when bottom trigger hits bottom of the viewport
    // markers: true,
}
})

numberTimeline.fromTo("#numbers-container", {
    scale: 0.8,
}, {

    scale: 1,
    duration: 3
}).to("#installs", {
    innerText: 300,
    duration: 3,
    snap: {
        innerText: 1
    },
}, "<").to("#hours", {
    innerText: 500,
    duration: 3,
    snap: {
        innerText: 1
    }
}, "<")

/* ----- PERSONAL CODE ---- */

// Variable globale pour stocker l'instance du graphique
let monChart = null;

// Fonction pour initialiser le graphique (à appeler une seule fois au chargement de la page)
function initialiserGraphique() {
    const ctx = document.getElementById('monGraphique').getContext('2d');
    monChart = new Chart(ctx, {
        type: 'scatter', // Type "nuage de points"
        data: {
            datasets: [{
                label: 'Position Entreprise',
                data: [], // Vide au début
                backgroundColor: '#3b82f6', // Ta couleur primary
                pointRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'IPA' },
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 1 }
                },
                y: {
                    title: { display: true, text: '3P' },
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Appeler l'initialisation au chargement
document.addEventListener('DOMContentLoaded', initialiserGraphique);

async function afficher() {

    const inputEntreprise = document.querySelector('input[placeholder="Entreprise"]');
    const nomEntreprise = inputEntreprise.value.trim();

    if (!nomEntreprise) return alert("Veuillez saisir un nom");

    // Feedback visuel
    document.getElementById("3P").innerHTML = "3P : Recherche...";
    document.getElementById("IPA").innerHTML = "IPA : Recherche...";

    // 1. Définition des IDs et des Requêtes
    const id3P = "1s0NOWEWUdUtiRQmK-_AjlX5lrI7PONLe03JK5H-v8Yg";
    const idIPA = "1B-EAXOyQ53JY4iSe7hcznYFBIYJTVE1mq-VvzVKbF6Y"; // 
    const req3P = `SELECT L WHERE K = '${nomEntreprise}'`;
    const reqIPA = `SELECT AQ WHERE AP = '${nomEntreprise}'`; 

    // Construction des URLs
    const url3P = `https://docs.google.com/spreadsheets/d/${id3P}/gviz/tq?tqx=out:json&tq=${encodeURIComponent(req3P)}`;
    const urlIPA = `https://docs.google.com/spreadsheets/d/${idIPA}/gviz/tq?tqx=out:json&tq=${encodeURIComponent(reqIPA)}`;

    try {
        // 2. Lancement des deux requêtes en PARALLÈLE
        const [res3P, resIPA] = await Promise.all([
            fetch(url3P),
            fetch(urlIPA)
        ]);

        // Extraction du texte
        const [text3P, textIPA] = await Promise.all([
            res3P.text(),
            resIPA.text()
        ]);

        // 3. Nettoyage et Parse des deux réponses
        const data3P = JSON.parse(text3P.substring(text3P.indexOf("{"), text3P.lastIndexOf("}") + 1));
        const dataIPA = JSON.parse(textIPA.substring(textIPA.indexOf("{"), textIPA.lastIndexOf("}") + 1));

        const score3P = data3P.table.rows[0].c[0].v;
        const scoreIPA = dataIPA.table.rows[0].c[0].v;
        // 4. Affichage des résultats
        // Traitement 3P
        if (data3P.table.rows.length > 0) {
            document.getElementById("3P").innerHTML = "3P : " + score3P.toFixed(2);
        } else {
            document.getElementById("3P").innerHTML = "3P : Non trouvé";
        }

        // Traitement IPA
        if (dataIPA.table.rows.length > 0) {
            document.getElementById("IPA").innerHTML = "IPA : " + scoreIPA.toFixed(2);
        } else {
            document.getElementById("IPA").innerHTML = "IPA : Non trouvé";
        }

        //affichage sur graphe
        if (monChart) {
            monChart.data.datasets[0].data = [{ x: scoreIPA, y: score3P }];
            monChart.update();
        }

    } catch (error) {
        console.error("Erreur globale:", error);
        alert("Une erreur est survenue lors de la récupération.");
    } finally {
        inputEntreprise.value = "";
    }
}


