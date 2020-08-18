<template>
  <div>
    <div class="row bg-blue-8 text-white items-center" style="height: 56px;">
      <div style="width:50px;" align="center">
        <q-icon name="fas fa-arrow-left" @click="backMain()" />
      </div>
      <div class="col" style="font-size: 20px;">การเขียน</div>
      <div style="width:50px" align="center">
        <!-- <q-btn round color="brown-9" push icon="fas fa-print" size="12px"></q-btn> -->
      </div>
    </div>
    <!-- title -->
    <div class="text-h6 q-py-md" align="center">{{title}}</div>
    <q-separator />
    <!-- list -->
    <div v-for="(item,index) in writingData" :key="index">
      <div class="row items-center">
        <div style="width:30px;" align="center">{{index+1}}</div>

        <div class="col q-pl-md q-py-sm">
          <div v-html="item.questionEng"></div>
          <div v-html="item.questionThai" style="font-size:14px;" class="text-grey-8"></div>
        </div>
      </div>

      <q-separator />
    </div>
  </div>
</template>

<script>
import { db, st } from "../router";
export default {
  data() {
    return {
      title: "",
      level: this.$route.params.lv,
      unit: this.$route.params.unit,
      writingData: []
    };
  },
  methods: {
    backMain() {
      this.$router.push("/main");
    },
    loadTitle() {
      db.collection("practiceListName")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .where("skill", "==", "Writing")
        .get()
        .then(doc => {
          this.title = doc.docs[0].data().name;
        });
    },
    loadWriting() {
      db.collection("practicelist")
        .where("practicetype", "==", "translation")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .get()
        .then(doc => {
          let listData = [];
          doc.forEach(data => {
            let temp = {
              id: data.id,
              order: data.data().order
            };
            listData.push(temp);
          });
          listData.sort((a, b) => a.order - b.order);
          listData.forEach(practice => {
            db.collection("practicepool_server")
              .where("practicekey", "==", practice.id)
              .get()
              .then(doc2 => {
                let slideDataTemp = [];
                doc2.forEach(data2 => {
                  let temp2 = {
                    questionEng: data2.data().questionEng,
                    questionThai: data2.data().questionThai,
                    order: data2.data().order
                  };

                  slideDataTemp.push(temp2);
                });
                slideDataTemp.sort((a, b) => a.order - b.order);
                slideDataTemp.forEach(data3 => {
                  this.writingData.push(data3);
                });
              });
          });
        });
    }
  },
  mounted() {
    if (this.$q.localStorage.getItem("lv") == null) {
      this.$router.push("/");
    }
    this.loadTitle();
    this.loadWriting();
  }
};
</script>

<style scoped>
</style>