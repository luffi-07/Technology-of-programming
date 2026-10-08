const questions = document.querySelectorAll(".question");

questions.forEach(question => {
    question.addEventListener("click", () => {
        const current = question.parentElement;

        document.querySelectorAll(".faq").forEach(item => {
            if (item !== current) {
                item.classList.remove("active");
            }
        });

        current.classList.toggle("active");
    });
});
