
Template.body.onRendered(function(){
    var margin = {top: 10, right: 40, bottom: 10, left: 40},
        width = 1060,
        height = 600;

    var svg = d3.select("svg")
        .attr({
            "width": width,
            "height": height
        })
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function get_x(ranking) {
        var y = get_y(ranking);
        return (ranking - y*(y-1)/2) - 1 + 20 - 0.5*y;
    }

    function get_y(ranking) {
        var k = Math.floor(Math.sqrt(2*ranking));
        while ((k*(k-1)/2) < ranking) {
            k++;
        }
        while ((k*(k-1)/2) >= ranking) {
            k--;
        }
        return k;
    }

    function get_title(d) {
        return d.name + " (" + d.ranking + "), " + d.country;
    }

    var x = d3.scale.linear()
        .domain([0,40])
        .range([0,width - margin.left - margin.right]);

    var y = d3.scale.linear()
        .domain([0,30])
        .range([0, height - margin.top - margin.bottom]);

    Deps.autorun(function(){
        console.log("autorun...");

        var cursor = MenSingles.find({date:Session.get('ranking_date')});

        console.log(cursor.count());

        if (cursor.count() < 499) {
            return;
        }

        var data = d3.nest()
            .sortValues(function(a,b) { return a.ranking - b.ranking; })
            .map(cursor.fetch(), d3.map);

        var images = svg.selectAll("image")
            .data(data, function(d) { return d.name; });
        images.select("title").text(function(d) { return get_title(d); });
        images.transition()
            .transition()
            .attr("opacity", 1)
            .duration(1500)
            .attr({
                "x": function(d) { return x(get_x(d.ranking)); },
                "y": function(d) { return y(get_y(d.ranking)); }
            });
        var new_images = images.enter()
            .append("image")
            .attr({
                "xlink:href": function(d) { return '//www.atpworldtour.com/~/media/images/flags/' + d.country + '.png'; },
                "x": function(d) { return x(get_x(d.ranking)); },
                "y": function(d) { return y(get_y(d.ranking)); },
                "width": 20,
                "height": 14,
                "preserveAspectRatio": "none",
                "opacity": 0
            });
        new_images.on("click", function() {
            highlight_country(this);
        })
            .append("title").text(function(d) { return get_title(d);});
        new_images.transition().duration(1500).attr('opacity', 1);
        images.exit().remove();
    });

    function highlight_country(element) {
        svg.selectAll("image")
            .transition()
            .duration(1500)
            .attr({
                "opacity": function(d) { return (d.country == element.__data__.country) ? 1 : 0.1; }
            })
            .transition()
            .duration(3000)
            .attr({
                "opacity": 1
            });
    }
});
