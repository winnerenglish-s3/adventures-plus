<template>
  <div style="height:100vh">
    <!-- Input box -->
    <div class="row" align="center" style="margin: 20px">
      <div class="col-6" style="padding-right: 10px;">
        <q-select
          filled
          v-model="input.lesson"
          :options="levelOption"
          map-options
          emit-value
          label="ระดับชั้น"
          dense
          @input="changeLesson()"
        />
      </div>

      <div class="col-6" style="padding-left: 10px;">
        <q-select
          filled
          v-model="input.unit"
          :options="listUnit"
          label="บทที่"
          dense
          class="aaa"
          @input="changeLesson()"
        />
      </div>
    </div>

    <!-- List zone -->
    <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />

    <div>
      <q-list>
        <q-item clickable v-ripple @click="chooseItem('v')">
          <q-item-section>
            <q-item-label>คำศัพท์</q-item-label>
            <q-item-label caption class="text-grey-8">{{practiceName[0]}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="#BDBDBD" />
          </q-item-section>
        </q-item>

        <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />

        <q-item clickable v-ripple @click="chooseItem('g')">
          <q-item-section>
            <q-item-label>ไวยากรณ์</q-item-label>
            <q-item-label caption class="text-grey-8">{{practiceName[1]}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="#BDBDBD" />
          </q-item-section>
        </q-item>

        <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />

        <q-item clickable v-ripple @click="chooseItem('r')">
          <q-item-section>
            <q-item-label>การอ่าน</q-item-label>
            <q-item-label caption class="text-grey-8">{{practiceName[2]}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="#BDBDBD" />
          </q-item-section>
        </q-item>

        <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />

        <q-item clickable v-ripple @click="chooseItem('w')">
          <q-item-section>
            <q-item-label>การเขียน</q-item-label>
            <q-item-label caption class="text-grey-8">{{practiceName[3]}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="#BDBDBD" />
          </q-item-section>
        </q-item>

        <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />

        <q-item clickable v-ripple @click="chooseItem('p')">
          <q-item-section>
            <q-item-label>การออกเสียง</q-item-label>
            <q-item-label caption class="text-grey-8">{{practiceName[4]}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="#BDBDBD" />
          </q-item-section>
        </q-item>

        <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />

        <q-item clickable v-ripple @click="chooseItem('s')">
          <q-item-section>
            <q-item-label>การฟังและการพูด</q-item-label>
            <q-item-label caption class="text-grey-8">{{practiceName[5]}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right" color="#BDBDBD" />
          </q-item-section>
        </q-item>

        <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />
      </q-list>
    </div>

    <div class="fixed-bottom cursor-pointer" style="height:52px;" align="center" @click="logout()">
      <q-separator color="#F2F2F2" inset style="width: 100%; margin: auto;" />
      <div style="padding-top:12px;">ออกจากระบบ</div>
    </div>
  </div>
</template>

<script>
import { db, st } from "../router";

export default {
  data() {
    return {
      input: {
        lesson: "",
        unit: "1",
      },
      listUnit: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
      ],
      levelOption: [], //ชั้นและ level ที่เรียน
      practiceNameListMix: [], //ชื่อแต่ละ world แบบคละกัน
      practiceName: [], //ชื่อแต่ละ world ที่ถูกจัดเป็น object แล้ว
    };
  },
  methods: {
    changeLesson() {
      this.practiceName = [];
      this.practiceNameListMix = [];
      db.collection("practiceListName")
        .where("level", "==", this.input.lesson)
        .where("unit", "==", this.input.unit)
        .get()
        .then((doc) => {
          doc.forEach((data) => {
            this.practiceNameListMix.push(data.data());
          });
          //Gammar

          let temp = this.practiceNameListMix.filter(
            (x) => x.skill == "Vocabulary"
          );
          this.practiceName.push(temp[0].name);

          temp = this.practiceNameListMix.filter((x) => x.skill == "Grammar");
          this.practiceName.push(temp[0].name);

          temp = this.practiceNameListMix.filter((x) => x.skill == "Reading");
          this.practiceName.push(temp[0].name);

          temp = this.practiceNameListMix.filter((x) => x.skill == "Writing");
          this.practiceName.push(temp[0].name);

          temp = this.practiceNameListMix.filter((x) => x.skill == "Phonics");
          this.practiceName.push(temp[0].name);

          temp = this.practiceNameListMix.filter(
            (x) => x.skill == "Listening & Speaking"
          );
          this.practiceName.push(temp[0].name);
        });
    },
    chooseItem(world) {
      if (world == "v") {
        this.$router.push(
          "/vocab/" + this.input.lesson + "/" + this.input.unit
        );
      } else if (world == "g") {
        this.$router.push(
          "/grammar/" + this.input.lesson + "/" + this.input.unit
        );
      } else if (world == "r") {
        this.$router.push(
          "/reading/" + this.input.lesson + "/" + this.input.unit
        );
      } else if (world == "w") {
        this.$router.push(
          "/writing/" + this.input.lesson + "/" + this.input.unit
        );
      } else if (world == "p") {
        this.$router.push(
          "/phonics/" + this.input.lesson + "/" + this.input.unit
        );
      } else if (world == "s") {
        this.$router.push("/ls/" + this.input.lesson + "/" + this.input.unit);
      }
    },
    logout() {
      this.$q.localStorage.remove("lv");
      this.$router.push("/");
    },
  },
  mounted() {
    if (this.$q.localStorage.getItem("lv") == null) {
      this.$router.push("/");
    }

    this.levelOption = this.$q.localStorage.getItem("lv");

    this.input.lesson = this.levelOption[0].value;
    this.changeLesson();
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