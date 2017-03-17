function(page) {
  var idle_dom = page.getIdleDom();
  var nr_dom_nodes = idle_dom.getElementsByTagName("*").length;
  var type = "info";
  var text = "Total DOM Nodes ~"+nr_dom_nodes+".";
  var comment = "";
  if(nr_dom_nodes > 1500)
  {
    comment = "Pretty big DOM!";
    type="warning";
  }

  if(nr_dom_nodes > 3000)
  {
    comment = "Excessive DOM!";
    type="error";
  }
  return this.createResult("DOM", text+" "+comment, type, "Idle");
}
