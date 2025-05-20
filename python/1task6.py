from collections import deque

class GraphChecker:
    def __init__(self):
        self.graph = {}
        self.vertices = 0

    def input_graph(self):
        print("\nВыберите способ задания графа:")
        print("1. Матрица смежности")
        print("2. Матрица инцидентности")
        print("3. Список смежности")
        choice = input("Ваш выбор (1/2/3): ")
        
        if choice == '1':
            self._input_adjacency_matrix()
        elif choice == '2':
            self._input_incidence_matrix()
        elif choice == '3':
            self._input_adjacency_list()
        else:
            print("Неверный выбор!")
            return False
        return True

    def _input_adjacency_matrix(self):
        self.vertices = int(input("Введите количество вершин: "))
        print("Введите матрицу смежности (построчно, через пробел):")
        
        # Инициализируем граф
        self.graph = {i: [] for i in range(self.vertices)}
        
        for i in range(self.vertices):
            row = list(map(int, input().split()))
            for j in range(self.vertices):
                if row[j] == 1:
                    self.graph[i].append(j)

    def _input_incidence_matrix(self):
        self.vertices = int(input("Введите количество вершин: "))
        edges = int(input("Введите количество ребер: "))
        print("Введите матрицу инцидентности (построчно, через пробел):")
        
        self.graph = {i: [] for i in range(self.vertices)}
        
        for _ in range(self.vertices):
            row = list(map(int, input().split()))
            
        for j in range(edges):
            vertices = []
            for i in range(self.vertices):
                if row[i*edges + j] == 1:  # Чтение элемента матрицы
                    vertices.append(i)
            
            if len(vertices) == 2:  # Для неориентированного графа
                u, v = vertices
                self.graph[u].append(v)
                self.graph[v].append(u)

    def _input_adjacency_list(self):
        self.vertices = int(input("Введите количество вершин: "))
        print("Введите список смежности (в формате 'вершина:сосед1 сосед2 ...'):")
        
        self.graph = {}
        for _ in range(self.vertices):
            parts = input().split(':')
            node = int(parts[0])
            neighbors = list(map(int, parts[1].split()))
            self.graph[node] = neighbors

    def calculate_components(self):
        visited = [False] * self.vertices
        components = 0
        
        for node in range(self.vertices):
            if not visited[node]:
                components += 1
                queue = deque([node])
                visited[node] = True
                
                while queue:
                    current = queue.popleft()
                    for neighbor in self.graph.get(current, []):
                        if not visited[neighbor]:
                            visited[neighbor] = True
                            queue.append(neighbor)
        
        return components

    def check_user_answer(self):
        user_answer = int(input("\nВведите ваше предположение о количестве компонент связности: "))
        correct_answer = self.calculate_components()
        
        if user_answer == correct_answer:
            print(f"✅ Верно! Граф действительно имеет {correct_answer} компонент(у/ы) связности.")
        else:
            print(f"❌ Неверно. Правильный ответ: {correct_answer} компонент(ы) связности.")

def main():
    print("Программа для проверки знания компонент связности графа")
    checker = GraphChecker()
    
    if checker.input_graph():
        print("\nГраф успешно загружен!")
        checker.check_user_answer()

if __name__ == "__main__":
    main()