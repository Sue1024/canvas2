(function() {
  var defaultOptions = {
      legend: {
          position: 'right',
          font: {
            weight: 'bold',
            size: 20,
            family: 'Arial'
          }
      },
      title: {
          text: 'Pie Chart',
          font: {
            weight: 'bold',
            size: 20,
            family: 'Arial'
          }
      },
      tooltip: {
          template: '<div>Year: {{label}}</div><div>Production: {{data}}</div>',
          font: {
            weight: 'bold',
            size: 20,
            family: 'Arial'
          }
      }
  };

  var plots = [];
  var cv, ctx, width, height, op, title_text, title_position, title_height,
      title_width, radius, center, legend_width, legend_height,
      legend_posX, legend_posY, legend_textX, legend_textY, startAngle = 0, endAngle = 0,
      currentPlot, data_c;

  this.drawPie = function(data, canvas, options){
      cv = canvas;
      canvas.onmousemove = onMouseMove;
      data_c = calculateData(data);
      if(canvas.getContext) {
        ctx = canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;

        op = generateOptions(options, defaultOptions);
        draw();
      }
  }

  function draw() {
    clear();
    title_text = op.title.text;

    ctx.font = op.title.font.weight + " " + op.title.font.size+"px " + op.title.font.family;
    title_width = ctx.measureText(title_text).width;
    title_height = op.title.font.size;

    title_position = {
      x: (width , title_width)/2,
      y: 20 + title_height
    };

    ctx.fillText(title_text, title_position.x, title_position.y);

    radius = (height - title_height - title_position.y - 20) / 2 ;
    center = {
      x: radius + 20,
      y: radius + 30 + title_position.y
    };
    legend_width = op.legend.font.size * 2.5;
    legend_height = op.legend.font.size * 1.2;
    legend_posX = center.x * 2 +20;
    legend_posY = 80;
    legend_textX = legend_posX + legend_width + 5;
    legend_textY = legend_posY + op.legend.font.size * 0.9;
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

    if(currentPlot) {
      var width = ctx.measureText("Hello").width;
      var height = parseInt(op.tooltip.font.size, 10);
      context.fillStyle = 'yellow';
      context.fillRect(center.x + radius*(3.14-currentPlot.start), radius*(3.14-currentPlot.start), width+3*2, height+3*2);
      context.fillStyle = '#000';
      context.fillText("Hello", radius*(3.14-currentPlot.start)+3, radius*(3.14-currentPlot.start)+3);
      // ctx.font = op.tooltip.font.weight + " " + op.tooltip.font.size+"px " + op.tooltip.font.family;
      // ctx.fillText(title_text, center.x, center.y);
    }

    for(var i=0, len=data_c.length; i<len; i++) {
        endAngle += data_c[i].portion * 2 * Math.PI;
        var plot = {
          start: startAngle,
          end: endAngle,
          color: data_c[i].color
        };
        plots.push(plot);
        drawPlot(data_c[i].color)
        startAngle = endAngle;
        legend_posY += (10 + legend_height);
        legend_textY += (10 + legend_height);
        drawLegend(data_c[i].label, data_c[i].portion);
    }

  }
  function clear() {
    ctx.clearRect(0, 0, cv.width, cv.height);
  }
  function drawPlot(color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();
  }

  function drawLegend(label, portion) {
    ctx.fillRect(legend_posX, legend_posY, legend_width, legend_height);
    ctx.font = 'bold 12px Arial';
    var percent = label + ' : ' + (portion * 100).toFixed(2) + '%';
    ctx.fillText(percent, legend_textX, legend_textY);
  }

  function onMouseMove(e) {
    var ex = e.pageX - cv.offsetLeft, ey = e.pageY - cv.offsetTop;
    var angle = getAngle(center.x, center.y, ex, ey);
    for(let i = 0; i < plots.length; i++) {
      if(plots[i].start < angle && plots[i].end > angle) {
        if(currentPlot != plots[i]) {
          currentPlot = plots[i];
          draw();
        }
        return;
      }
      currentPlot == null;
      draw();
    }
  }

  function mergeJSON(source1,source2){
    var mergedJSON = JSON.parse(JSON.stringify(source2));
    for (var attrname in source1) {
      if(mergedJSON.hasOwnProperty(attrname)) {
        if ( source1[attrname]!=null && source1[attrname].constructor==Object ) {
          mergedJSON[attrname] = mergeJSON(source1[attrname], mergedJSON[attrname]);
        }
      } else {
        mergedJSON[attrname] = source1[attrname];
      }
    }
    return mergedJSON;
  }

  function generateOptions(givenOptions, defaultOptions) {
    return mergeJSON(defaultOptions, givenOptions);
  }
  function calculateData(data) {
    if(data instanceof Array) {
      var sum = data.reduce(function(a, b) {
        return a + b.data;
      }, 0);
      var map = data.map(function(a) {
        return {
          label: a.label,
          data: a.data,
          color: a.color,
          portion: a.data/sum
        }
      });
      return map;
    }
  }

  function getAngle(cx,cy,mx,my){
    var x = Math.abs(cx-mx),
        y = Math.abs(cy-my),
        z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)),
        cos = y/z,
        radina = Math.acos(cos),
        angle = Math.floor(180/(Math.PI/radina));

    if(mx > cx && my > cy){
        angle = 180 - angle;
    }

    if(mx == cx && my > cy){
        angle = 180;
    }

    if(mx > cx && my == cy){
        angle = 90;
    }

    if(mx < cx && my > cy){
        angle = 180 + angle;
    }

    if(mx < cx && my == cy){
        angle = 270;
    }

    if(mx < cx && my < cy){
        angle = 360 - angle;
    }

    return 2 * Math.PI * (angle/360);
  }
})(window)
