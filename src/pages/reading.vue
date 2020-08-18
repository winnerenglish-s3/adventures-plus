<template>
  <div>
    <div class="row bg-blue-8 text-white items-center" style="height: 56px;">
      <div style="width:50px;" align="center">
        <q-icon name="fas fa-arrow-left" @click="backMain()" />
      </div>
      <div class="col" style="font-size: 20px;">การอ่าน</div>
      <div style="width:50px" align="center">
        <!-- <q-btn round color="brown-9" push icon="fas fa-print" size="12px"></q-btn> -->
      </div>
    </div>
    <div class="text-h6 q-py-md" align="center">{{readingData.titleEng}}</div>
    <div>
      <q-img :src="readingData.imageUrl" width="100%" />
    </div>
    <div class="q-pt-md q-px-sm" v-html="readingData.contentEng"></div>
    <q-separator />
    <div class="text-h6 q-pt-md" align="center">{{readingData.titleThai}}</div>
    <div class="q-pt-md q-px-sm" v-html="readingData.contentThai"></div>
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
      readingData: [],
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
        .where("skill", "==", "Reading")
        .get()
        .then((doc) => {
          this.title = doc.docs[0].data().name;
        });
    },
    loadReading() {
      db.collection("practicelist")
        .where("skill", "==", "Reading")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .get()
        .then((doc) => {
          let readingListId = [];
          doc.forEach((data) => {
            let temp = {
              id: data.id,
              order: data.data().order,
            };
            readingListId.push(temp);
          });
          readingListId.sort((a, b) => a.order - b.order);
          let pracId = readingListId[1].id;
          db.collection("readingcontent_server")
            .where("practicekey", "==", pracId)
            .get()
            .then((doc2) => {
              doc2.forEach((data2) => {
                this.readingData = {
                  contentEng: data2.data().contentEng.replace(/\[tab]/g, ""),
                  contentThai: data2.data().contentThai.replace(/\[tab]/g, ""),
                  titleEng: data2.data().titleEng,
                  titleThai: data2.data().titleThai,
                  imageUrl: data2.data().imageURL,
                };
              });
            });
        });
    },
  },
  mounted() {
    if (this.$q.localStorage.getItem("lv") == null) {
      this.$router.push("/");
    }
    this.loadTitle();
    this.loadReading();
  },
};
</script>

<style scoped>
</style>