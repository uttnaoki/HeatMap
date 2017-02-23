var w = 1000;
var h = 700;

// SVG要素生成
var svg = d3.select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


var color = d3.scale.category10();

d3.json("okayama.topojson", function(json) {
    var okayama = topojson.object(json, json.objects.okayama).geometries;

    // 投影法設定
    var projection = d3.geo.mercator()
        .center([133.47, 34.7])
        // .center([133.837613, 34.94759])
        .translate([w / 2, h / 2 + 100])
        .scale(28000);

    // 緯度経度⇒パスデータ変換設定
    var path = d3.geo.path()
        .projection(projection);

    d3.csv("tokkakeisu2.csv", function(error, data) {
        if (error) throw error;
        tmp = data.map(function(d) {
            return +d[category[0]];
            // return +d.建設;
        });
        max = d3.max(tmp);
        for (var i = 0; i < tmp.length; i++)
            value[city[i]] = tmp[i];

        svg.append("text")
            .attr({
                id: "current_category",
                x: w / 2 + 180,
                y: 40,
                "font-size": "40px",
                "font-weight": "bold",
                "text-anchor": "middle"
            })
            .text(category[0])

        // パスデータとして日本地図描画
        svg.selectAll("path")
            .data(okayama)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "red")
            .attr("opacity", function(d, i) {
                return value[d.properties.city] / max;
            })
            .attr("class", "okayama_map")
            .attr("id", function(d, i) {
                return "map_" + d.properties.city;
            })
            .on("mouseover", function(d, i) {
                d3.select("#text1")
                    .text(d.properties.city)
                d3.select("#text2")
                    .text("産業特化係数(従業者数):" + value[d.properties.city])
                d3.select("#tooltip")
                    .style({
                        "visibility": "visible",
                        "background-color": "green"
                    })
            })
            .on("mousemove", function(d) {
                return d3.select("#tooltip")
                    .style("top", (event.pageY - 70) + "px")
                    .style("left", (event.pageX + 15) + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip")
                    .style("visibility", "hidden")
            });

        var button = svg.append("g")
            .attr({
                "transform": "translate(60,80)",
                class: "button",
                cursor: "pointer"
            })


        button.selectAll("rect")
            .data(category)
            .enter()
            .append("rect")
            .attr({
                y: function(d, i) {
                    return i * 80;
                },
                width: 200,
                height: 50,
                fill: "rgba(113, 232, 196, 0.81)",
            })
            .on("click", function(d) {
                update(d);
            })

        button.selectAll("text")
            .data(category)
            .enter()
            .append("text")
            .text(function(d) {
                return d;
            })
            .attr({
                x: 100,
                y: function(d, i) {
                    return i * 80 + 33;
                },
                "font-size": "20px",
                "text-anchor": "middle"
            })
            .on("click", function(d) {
                update(d);
            })
            
            svg.append("rect")
            .attr({
              id: "current_select",
              y: 0,
              width: 220,
              height: 80,
              fill: "orange",
              opacity: 0.5,
              "transform": "translate(50,65)"
            })

        function update(key) {
            tmp = [];
            value = [];
            tmp = data.map(function(d) {
                return +d[key];
            });
            max = d3.max(tmp);
            d3.select(".map_" + city[0])
                .attr("fill", "blue")
                .attr("opacity", 1)
            for (var i = 0; i < tmp.length; i++) {
                value[city[i]] = tmp[i];
            }
            svg.selectAll("path")
                .data(okayama)
                .transition()
                .duration(500)
                .attr("opacity", function(d, i) {
                    return value[d.properties.city] / max;
                })
            svg.select("#current_category")
                .text(key)
            d3.select("#current_select")
            .transition()
            .duration(500)
            .attr({
              y: category.indexOf(key)*80
            })
        }
    });
});


var category = [
    "建設",
    "製造",
    "輸送関連",
    "販売関連",
    "業務管理・事務関連",
    "農林水産",
    "サービス業"
]

var value = {
    "岡山市": 0,
    "倉敷市": 0,
    "津山市": 0,
    "玉野市": 0,
    "笠岡市": 0,
    "井原市": 0,
    "総社市": 0,
    "高梁市": 0,
    "新見市": 0,
    "備前市": 0,
    "瀬戸内市": 0,
    "赤磐市": 0,
    "真庭市": 0,
    "美作市": 0,
    "浅口市": 0,
    "和気町": 0,
    "早島町": 0,
    "里庄町": 0,
    "矢掛町": 0,
    "新庄村": 0,
    "鏡野町": 0,
    "勝央町": 0,
    "奈義町": 0,
    "西粟倉村": 0,
    "久米南町": 0,
    "美咲町": 0,
    "吉備中央町": 0
};
var city = [
    "岡山市",
    "倉敷市",
    "津山市",
    "玉野市",
    "笠岡市",
    "井原市",
    "総社市",
    "高梁市",
    "新見市",
    "備前市",
    "瀬戸内市",
    "赤磐市",
    "真庭市",
    "美作市",
    "浅口市",
    "和気町",
    "早島町",
    "里庄町",
    "矢掛町",
    "新庄村",
    "鏡野町",
    "勝央町",
    "奈義町",
    "西粟倉村",
    "久米南町",
    "美咲町",
    "吉備中央町"
];
