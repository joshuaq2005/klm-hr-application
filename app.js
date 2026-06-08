document.getElementById("applicationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = e.target;

    const application = {
        id: "APP-" + Date.now(),

        submittedAt: new Date().toLocaleString(),

        discordUsername: form.discordUsername.value,
        discordID: form.discordID.value,

        hrExperience: form.hrExperience.value,
        hrResponsibilities: form.hrResponsibilities.value,
        differentiation: form.differentiation.value,
        benefits: form.benefits.value,
        fitPosition: form.fitPosition.value,

        tamperedFiles: form.tamperedFiles.value,
        supportTicket: form.supportTicket.value,
        readLog: form.readLog.value,

        hoursPerWeek: form.hoursPerWeek.value,
        signatureDID: form.signatureDID.value,

        status: "Pending"
    };

    let applications =
        JSON.parse(localStorage.getItem("applications")) || [];

    applications.push(application);

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

    document.getElementById("successModal").classList.add("show");
});
