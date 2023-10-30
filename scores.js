fetch("scoreboard.json")
  .then((response) => response.json())
  .then((data) => {
  data.forEach((row) => {
    row.winRate = (((row.wins??0) / row.games) * 100.0).toFixed(2);
  });
  data.sort((a, b) => b.winRate - a.winRate);
  data.forEach((row, index) => {
    if (index === 0)
      row.rank = 1;
    else
      row.rank = data[index - 1].rank + 1;
  });
  data.forEach((row) => {
    $("#scoreTable").append(
      "<tr><td>" + 
      row.rank +
      "</td><td>" +
      row.name +
      "</td><td>" +
      (row.wins??0) +
      "</td><td>" +
      (row.losses??0) +
      "</td><td>" +
      row.games +
      "</td><td>" +
      row.winRate +
      "</td></tr>"
    );
  });
  $(document).ready(function () {
    $("#scoreTable").DataTable({
        autoWidth: true,
        scrollY: true,
        scrollX: true,
        dom: '<lf<t>Bip>',
        lengthMenu: [
          [10,20,25,50,-1], 
          [10,20,25,50,"All"]
        ],
        columnDefs: [
          {"width" : "100px", "targets": 0},
          {"width" : "250px", "targets": 1},
          {"width" : "70px", "targets": 2},
          {"width" : "70px", "targets": 3},
          {"width" : "70px", "targets": 4},
          // {"width" : "100px", "targets": 5},
        ],
        buttons: [
          'csv', 
          {
            extend: 'pdfHtml5',
            orientation: 'landscape',
            pageSize: 'LEGAL'
          },
        ],
      });
    });
  });