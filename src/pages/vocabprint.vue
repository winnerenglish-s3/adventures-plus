<template>
  <div align="center">
    <div class="bg7 printMe shadow-1 paper-a4 q-my-lg cl2">
      <!-- หัวกระดาษ -->
      <table>
        <thead>
          <tr style="height: 15px;">หัวกระดาษ</tr>
        </thead>
        <tbody>
          <tr align="center">
            <td class="q-pt-lg" style="width:760px">กระดาษ</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // window.print();
  },
};
</script>

<style scoped>
.greybox {
  outline: 1px solid gray;
}
.boxGrap {
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
}
.box {
  border: 1px solid #5c5c5c;
}
.paper-a4 {
  background: #ffffff;
  width: 210mm;
  min-height: 297mm;
  max-height: fit-content;
}
@media print {
  body {
    background: #ffffff;
  }
  .bg-print {
    padding: 0px 0px;
  }
  body,
  .printMe {
    background: #ffffff;
    margin: 0px 0px;
    margin-bottom: 0px;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    border: transparent;
  }

  #printBtn {
    display: none;
  }
}
@page {
  margin: 0mm;
  width: 210mm;
  height: 297mm;
  /* size: landscape; portrait */
}
</style>