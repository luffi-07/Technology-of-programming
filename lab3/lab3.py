class Student:
    def __init__(self, name, age, specialty):
        self.name = name
        self.age = age
        self.specialty = specialty

    def show_info(self):
        print(f"Имя: {self.name}")
        print(f"Возраст: {self.age}")
        print(f"Специальность: {self.specialty}")

    def change_specialty(self, new_specialty):
        self.specialty = new_specialty


student = Student("Иван", 20, "Программирование")

student.show_info()

student.change_specialty("Информационные системы")

print("\nПосле изменения специальности:")
student.show_info()
