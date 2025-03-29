def get_function_vector():
    """Запрашивает у пользователя вектор функции и проверяет его корректность."""
    while True:
        vector = input("Введите вектор булевой функции (последовательность 0 и 1): ").strip()
        
        # Проверка на пустую строку
        if not vector:
            print("Ошибка: Вектор не может быть пустым!")
            continue
        
        # Проверка, что все символы - 0 или 1
        if any(c not in {'0', '1'} for c in vector):
            print("Ошибка: Вектор должен содержать только 0 и 1!")
            continue
        
        # Проверка, что длина вектора - степень двойки
        n = len(vector)
        if n & (n - 1) != 0:
            print("Ошибка: Длина вектора должна быть степенью двойки (1, 2, 4, 8, 16, ...)!")
            continue
        
        return [int(c) for c in vector]

def find_dnf(function_vector):
    """Находит ДНФ для булевой функции по её вектору значений."""
    n = len(function_vector)
    num_vars = 0
    while (1 << num_vars) < n:
        num_vars += 1
    
    dnf_terms = []
    
    for i in range(n):
        if function_vector[i] == 1:
            term = []
            for j in range(num_vars):
                var_num = num_vars - j - 1
                if (i >> j) & 1:
                    term.append(f"x{var_num}")
                else:
                    term.append(f"¬x{var_num}")
            dnf_terms.append(" ∧ ".join(term))
    
    if not dnf_terms:
        return "0"
    elif len(dnf_terms) == n:
        return "1"
    else:
        return " ∨ ".join(f"({term})" for term in dnf_terms)

def main():
    print("Программа для нахождения ДНФ булевой функции по её вектору значений")
    
    vector = get_function_vector()
    dnf = find_dnf(vector)

    print(f"ДНФ: {dnf}")

if __name__ == "__main__":
    main()