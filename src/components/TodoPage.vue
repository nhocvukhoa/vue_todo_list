<template>
  <div class="row todo-content">
    <div class="col-md-6">
      <div class="todo-list not-done">
        <h1>TODOS</h1>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Enter content"
            v-model="textContent"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              @click="addTask"
            >
              Add
            </button>
          </div>
        </div>
        <p :class="{ 'error-text': error.status }">{{ error.message }}</p>
        <hr />
        <div v-if="todos.length">
          <ul class="list-unstyled">
            <li
              class="ui-state-default li-items mt-1"
              v-for="todo in todos"
              :key="todo.id"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input
                      type="checkbox"
                      aria-label="Radio button for following text input"
                      :checked="todo.checked"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'done-task': todo.completed }"
                  v-model="todo.content"
                />
                <div class="input-group-append remove-icon">
                  <span class="input-group-text" @click="deleteTask(todo.id)"
                    >&#10060;</span
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Chưa có task nào được tạo</p>
        </div>
        <hr />
        <div class="todo-footer row">
          <div class="col-md-6">
            <div class="form-check form-check-inline" @click="checkAll(true)">
              &#9989;
              <label class="form-check-label" for="inlineRadio1"
                >Check all</label
              >
            </div>
            <div class="form-check form-check-inline" @click="checkAll(false)">
              &#10062;
              <label class="form-check-label" for="inlineRadio2"
                >UnCheck all</label
              >
            </div>
          </div>
          <div class="col-md-6 save-all">
            <div class="form-check form-check-inline save-all">
              <button type="button" class="btn btn-success btn-sm">
                DONE ALL &#10004;
              </button>
            </div>
            <div class="form-check form-check-inline save-all">
              <button type="button" class="btn btn-dark btn-sm">
                DEL ALL &#10006;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";

export default {
  data() {
    return {
      todos: [],
      error: {
        message: "",
        status: false,
      },
      textContent: "",
      code: 2,
    };
  },
  created() {
    axios.get("http://127.0.0.1:8000/api/todos").then((response) => {
      this.todos = response.data.data;
    });
  },
  methods: {
    addTask() {
      if (this.textContent.trim().length === 0) {
        this.error = {
          message: "Không được để trống nội dung",
          status: true,
        };
      } else if (this.textContent.length > 30) {
        this.error = {
          message: "Nội dung chỉ giới hạn 30 ký tự",
          status: true,
        };
      } else {
        let params = {
          id: this.code,
          content: this.textContent,
          checked: false,
          completed: false,
        };

        axios.post("http://127.0.0.1:8000/api/add", params).then((response) => {
          this.todos = response.data.data;
          this.textContent = "";
          toastr.success("Thêm task thành công!");
        });

        this.error = {
          message: "",
          status: false,
        };
      }
    },
    deleteTask(id) {
      if (confirm("Bạn có chắc chắn muốn xóa task này không?")) {
        axios
          .post("http://127.0.0.1:8000/api/delete/", { id: id })
          .then((response) => {
            this.todos = response.data.data;
            toastr.success("Xóa task thành công!");
          });
      }
    },
    checkAll(flag) {
      this.todos.forEach((todo) => {
        todo.checked = flag;
      });
    },
  },
};
</script>

<!-- Thêm "scoped" giới hạn CSS bên dưới chỉ áp dụng cho component này -->
<style scoped>
.todo-content {
  display: flex;
  justify-content: center;
}

.todo-list h1 {
  margin-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.todo-footer {
  background-color: #d2e8ca;
  padding: 10px 20px 15px;
}

#done-items li {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  text-decoration: line-through;
}

.done-task {
  text-decoration: line-through;
  color: orange;
}

.form-check-inline {
  cursor: pointer;
}

.remove-icon span {
  cursor: pointer;
}

.save-all {
  float: right;
}

.input-group-text {
  height: 100%;
}

.error-text {
  color: red;
}
</style>
