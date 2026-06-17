import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const categories = ["Pågående", "Vill se", "Favoriter"];

  const [activeCategory, setActiveCategory] = useState("Pågående");

  const [movies, setMovies] = useState([
    { title: "Breaking Bad", meta: "S03 · Netflix", category: "Pågående" },
    { title: "The Bear", meta: "S02 · Disney+", category: "Pågående" },
    { title: "Dune: Part Two", meta: "Film · HBO", category: "Vill se" },
    { title: "Inception", meta: "Film · Netflix", category: "Vill se" },
    { title: "Stranger Things", meta: "S04 · Netflix", category: "Favoriter" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMeta, setNewMeta] = useState("");
  const [newCategory, setNewCategory] = useState("Pågående");

  useEffect(() => {
    const loadMovies = async () => {
      const savedMovies = await AsyncStorage.getItem("movies");

      if (savedMovies) {
        setMovies(JSON.parse(savedMovies));
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  const filteredMovies = movies.filter(
    (movie) => movie.category.trim() === activeCategory
  );

  const addMovie = () => {
    if (!newTitle) return;

    setMovies([
      ...movies,
      { title: newTitle, meta: newMeta, category: newCategory },
    ]);

    setNewTitle("");
    setNewMeta("");
    setNewCategory("Pågående");
    setModalVisible(false);
  };

  const deleteMovie = (movieIndex: number) => {
    const updatedMovies = movies.filter((_, index) => index !== movieIndex);
    setMovies(updatedMovies);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>CuePin 🚀</Text>
        <Text style={styles.subtitle}>Samla och pinn dina filmer & serier</Text>
      </View>

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>＋ Lägg till film eller serie</Text>
      </Pressable>

      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={
                activeCategory === cat
                  ? styles.categoryChipActive
                  : styles.categoryChip
              }
            >
              <Text
                style={
                  activeCategory === cat
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        {filteredMovies.length === 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "#94a3b8", fontSize: 16 }}>
              Inga filmer i {activeCategory}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {activeCategory === "Pågående" && "📺 Pågående"}
          {activeCategory === "Vill se" && "⭐ Vill se"}
          {activeCategory === "Favoriter" && "❤️ Favoriter"}
        </Text>

        {filteredMovies.map((movie) => {
          const movieIndex = movies.indexOf(movie);

          return (
            <View
              key={movieIndex}
              style={[
                styles.card,
                movie.category === "Pågående" && {
                  borderLeftColor: "#3b82f6",
                  borderLeftWidth: 4,
                },
                movie.category === "Vill se" && {
                  borderLeftColor: "#facc15",
                  borderLeftWidth: 4,
                },
                movie.category === "Favoriter" && {
                  borderLeftColor: "#ef4444",
                  borderLeftWidth: 4,
                },
              ]}
            >
              <Text style={styles.cardTitle}>{movie.title}</Text>
              <Text style={styles.cardMeta}>{movie.meta}</Text>

              <Pressable
                onPress={() => deleteMovie(movieIndex)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Ta bort</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lägg till film/serie</Text>

            <TextInput
              placeholder="Titel"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
              placeholderTextColor="#94a3b8"
            />

            <TextInput
              placeholder="Meta (ex. S01 · Netflix)"
              value={newMeta}
              onChangeText={setNewMeta}
              style={styles.input}
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.categoryLabel}>Kategori:</Text>

            <View style={styles.modalCategories}>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setNewCategory(cat)}
                  style={[
                    styles.categoryChip,
                    newCategory === cat && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={
                      newCategory === cat
                        ? styles.categoryTextActive
                        : styles.categoryText
                    }
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={addMovie}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.addButtonText}>Lägg till</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Avbryt</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#cbd5e1",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  cardMeta: {
    marginTop: 4,
    fontSize: 13,
    color: "#94a3b8",
  },
  deleteButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryWrapper: {
    marginTop: 20,
    paddingLeft: 20,
  },
  categoryChip: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  categoryText: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#022c22",
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    marginHorizontal: 20,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#022c22",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "white",
  },
  input: {
    backgroundColor: "#0f172a",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryLabel: {
    marginTop: 8,
    marginBottom: 4,
    color: "#cbd5e1",
  },
  modalCategories: {
    flexDirection: "row",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#22c55e",
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#ef4444",
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});