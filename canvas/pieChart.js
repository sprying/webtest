/**
 * Created with JetBrains WebStorm.
 * User: sprying
 * Date: 1/12/14
 * Time: 7:13 PM
 * To change this template use File | Settings | File Templates.
 */
function pieChart(data,width,height,cx,cy,r,colors,labels,lx,ly){
    var svgns = "http://www.w3.org/2000/svg";
    var chart = document.createElementNS(svgns,"svg:svg");
    chart.setAttribute("width",width);
    chart.setAttribute("height",height);
    chart.setAttribute("viewBox","0 0 " + width + " " + height);

    var total = 0;
    for(var i = 0,len = data.length;i<len;i++) total +=data[i];

    var angles = [];
    for(var i = 0,len =data.length;i<len;i++) angles[i] = data[i]/total * Math.PI * 2;

    var startAngle = 0;
    for(var i= 0,len =data.length;i<len;i++){
        var endAngle = startAngle + angles[i];

        var x1 = cx + r * Math.sin(startAngle);
        var y1 = cy - r * Math.cos(startAngle);
        var x2 = cx + r * Math.sin(endAngle);
        var y2 = cy - r * Math.cos(endAngle);

        var big  = 0;
        if(endAngle - startAngle > Math.PI) big = 1;

        var  path = document.createElementNS(svgns,"path");

        var d = "M " + cx +"," + cy +
            " L " + x1 +"," + y1 +
            " A " + r +","+r +
            " 0 " + big + " 1 " +
            x2 + "," + y2 +
            " Z";
        path.setAttribute("d" ,d);
        path.setAttribute("fill", colors[i]);
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width","2");
        chart.appendChild(path);

        startAngle = endAngle;

        var icon  =document.createElementNS(svgns,"rect");
        icon.setAttribute("x",lx);
        icon.setAttribute("y",ly + 30*i);
        icon.setAttribute("width",20);
        icon.setAttribute("height",20);
        icon.setAttribute("fill",colors[i]);
        icon.setAttribute("stroke","black");
        icon.setAttribute("stroke-width","2");
        chart.appendChild(icon);

        var label = document.createElementNS(svgns,"text");
        label.setAttribute("x",lx +30);
        label.setAttribute("y",ly+30*i +18);
        label.setAttribute("font-family","sans-serif");
        label.setAttribute("font-size","16");
        label.appendChild(document.createTextNode(labels[i]));
        chart.appendChild(label);
    }

    return chart;
}