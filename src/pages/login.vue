<template>
  <div>
    <!-- BG & Logo -->
    <div align="center" style class="bg">
      <div class="relative-position" style="top: 60px">
        <img src="../../public/pictures/logo.png" />
      </div>
    </div>

    <div
      class="bg-white relative-position"
      style="width: 100%; height: calc(100vh - 240px); top: -20px; border-radius: 30px 30px 0px 0px;"
    >
      <!-- รหัสผู้ใช้งาน & รหัสผ่าน -->
      <div class="relative-position" style="top: 50px; width: 90%; margin: auto">
        <q-input
          dense
          rounded
          outlined
          v-model="input.username"
          class="q-py-md"
          placeholder="รหัสผู้ใช้งาน"
        />
        <q-input
          dense
          rounded
          outlined
          v-model="input.password"
          placeholder="รหัสผ่าน"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>

      <!-- เข้าสู่ระบบ -->
      <div class="relative-position" style="top: 70px;" align="center">
        <q-btn
          push
          rounded
          color="primary"
          label="เข้าสู่ระบบ"
          style="width: 190px;"
          @click="login()"
        />
      </div>

      <!-- ลืมรหัสผ่าน -->
      <div class="relative-position" style="top: 80px;" align="center">
        <span class="text-blue-8 cursor-pointer" @click="forgetPassword()">
          <u>ลืมรหัสผ่าน?</u>
        </span>
      </div>
    </div>

    <!-- Dialog ลืมรหัสผ่านเข้าสู่ระบบ -->
    <q-dialog v-model="forgetDialog">
      <q-card style="width:100%; height:180px;">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="far fa-frown" color="negative" />
            <span class="q-pl-md">ไม่สามารถเข้าสู่ระบบได้</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง</q-card-section>
        <div style="width:100px; height:30px;"></div>
        <q-card-actions align="right">
          <span class="q-px-md" @click="closeforget()">
            <u>ตกลง</u>
          </span>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog ลืมรหัสผ่านเข้าสู่ระบบ -->
    <q-dialog v-model="passwordFailDialog">
      <q-card style="width:100%; height:190px;">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="fas fa-unlock-alt" color="amber-8" />
            <span class="q-pl-md">ลืมรหัสผ่านเข้าสู่ระบบ</span>
          </div>
        </q-card-section>

        <div class="row">
          <div style="width:90px" class="q-pl-md">คุณครู :</div>
          <div class="col">ติดต่อผู้ประสานงานโรงเรียน</div>
        </div>
        <div class="row">
          <div style="width:90px"></div>
          <div class="col">โทร 084-323-2206</div>
        </div>
        <div class="row">
          <div style="width:90px" class="q-pl-md">นักเรียน</div>
          <div class="col">ติดต่อคุณครูผู้สอน</div>
        </div>

        <div style="width:100px; height:5px;"></div>
        <q-card-actions align="right">
          <span class="q-px-md" @click="closePassword()">
            <u>ตกลง</u>
          </span>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { db, st } from "../router";
export default {
  data() {
    return {
      input: {
        username: "",
        password: "",
      }, //input form
      schoolKey: "", //รหัสโรงเรียน
      term: "", //เทอมปัจจุบัน
      year: "", //ปีการศึกษาปัจจุบัน
      isPwd: true, //เปิดปิด Password
      forgetDialog: false, //เปิด Dialog ลืม password
      passwordFailDialog: false, //เปิดปิด ใส่รหัสผิด
      student: [], //ข้อมูลนักเรียนของโรงเรียนที่ครูอยู่เทอมปัจจุบัน
      levelList: [], //List ของ Level ที่ใช้กับ select ในหน้า main
    };
  },
  methods: {
    login() {
      this.levelList = [];
      db.collection("teacher")
        .where("userName", "==", this.input.username)
        .where("password", "==", this.input.password)
        .get()
        .then((doc) => {
          if (doc.size) {
            this.schoolKey = doc.docs[0].data().schoolKey;

            db.collection("student")
              .where("schoolKey", "==", this.schoolKey)
              .where("term", "==", this.term)
              .where("year", "==", this.year)
              .get()
              .then((docs) => {
                docs.forEach((element) => {
                  this.student.push(element.data());
                });
                let data = this.student.map(
                  (x) => x.classRoom + "**" + x.level
                );
                data = [...new Set(data)];
                data.sort();
                data.forEach((x) => {
                  let temp = x.split("**");
                  let dataTemp = {
                    value: temp[1],
                    label: temp[0],
                  };
                  this.levelList.push(dataTemp);
                });
                this.$q.localStorage.set("lv", this.levelList);
                this.$router.push("/main");
              });
          } else {
            this.forgetDialog = true;
          }
        });
    },
    forgetPassword() {
      this.passwordFailDialog = true;
    },
    closePassword() {
      this.passwordFailDialog = false;
    },
    closeforget() {
      this.forgetDialog = true;
    },
    closeforget() {
      this.forgetDialog = false;
    },
    loadTerm() {
      db.collection("term")
        .doc("data")
        .get()
        .then((data) => {
          this.term = data.data().term;
          this.year = data.data().year;
        });
    },
  },

  mounted() {
    if (this.$q.localStorage.getItem("lv") != null) {
      this.$router.push("/main");
    }
    this.loadTerm();
  },
};
</script>

<style scoped>
.bg {
  background-image: url("../../public/pictures/bg.png");
  width: 100%;
  height: 240px;
  background-size: cover;
}
</style>