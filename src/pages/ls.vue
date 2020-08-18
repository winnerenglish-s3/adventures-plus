<template>
  <div>
    <div class="row bg-blue-8 text-white items-center" style="height: 56px;">
      <div style="width:50px;" align="center" @click="backMain()">
        <q-icon name="fas fa-arrow-left" />
      </div>
      <div class="col" style="font-size: 20px;">การฟังและการพูด</div>
      <!-- <div style="width:50px" align="center">
        <q-btn round color="brown-9" push icon="fas fa-print" size="12px"></q-btn>
      </div>-->
    </div>
    <!-- title -->
    <div class="text-h6 q-py-md" align="center">{{title}}</div>
    <q-separator />
    <!-- list -->
    <div v-for="(item,index) in lsData" :key="index">
      <div class="row items-center">
        <div style="width:80px;" align="center">{{item.speakerName}} :</div>

        <div class="col q-pl-md q-py-sm">
          <div v-html="item.conversationEng"></div>
          <div v-html="item.conversationThai"></div>
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
      lsData: [], //ข้อมูลที่ใช้ในการแสดงผล
      speakList: [], //Temp สำหรับ หาชื่อคน
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
        .where("skill", "==", "Listening & Speaking")
        .get()
        .then((doc) => {
          this.title = doc.docs[0].data().name;
        });
    },
    loadls() {
      db.collection("practicelist")
        .where("practicetype", "==", "speaking")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .get()
        .then((doc) => {
          let listData = [];
          doc.forEach((data) => {
            let temp = {
              id: data.id,
              order: data.data().order,
            };
            listData.push(temp);
          });
          listData.sort((a, b) => a.order - b.order);
          listData.forEach((practice) => {
            db.collection("practicepool_server")
              .where("practicekey", "==", practice.id)
              .get()
              .then((doc2) => {
                let slideDataTemp = [];
                doc2.forEach((data2) => {
                  let speakerName = this.speakList.filter(
                    (x) => x.id == data2.data().nameKey
                  )[0].speakerName;
                  let temp2 = {
                    conversationEng: data2.data().conversationEng,
                    conversationThai: data2.data().conversationThai,
                    order: data2.data().order,
                    speakerName: speakerName,
                  };

                  slideDataTemp.push(temp2);
                });
                slideDataTemp.sort((a, b) => a.order - b.order);
                slideDataTemp.forEach((data3) => {
                  this.lsData.push(data3);
                });
              });
          });
        });
    },
    loadSpeaker() {
      db.collection("conversationSpeaker")
        .get()
        .then((doc) => {
          doc.forEach((data) => {
            let temp = {
              id: data.id,
              speakerName: data.data().nameConversationer,
            };

            this.speakList.push(temp);
          });
        });
    },
  },
  mounted() {
    if (this.$q.localStorage.getItem("lv") == null) {
      this.$router.push("/");
    }
    this.loadTitle();
    this.loadSpeaker();
    this.loadls();
  },
};
</script>

<style scoped>
</style>