

//$.get( "https://jsonplaceholder.typicode.com/users",{}, function( data ,textstat,th) {
//  console.log( data.forEach(v=>{
//      $p=$('<p>'+v.name+'</p>')
//      $('.div1').append($p)
//      console.log(v.name)}) );
// console.log(textstat)
// console.log(th)
// 
//});
//
//(function ($) {
//    
//    
//    
//    
//    $.fn.wassim=function () {
//        
//    return this.each(function (){
//        
//         $(this).hide(3000).show(4000).fadeToggle(3000).fadeToggle(3000).fadeToggle(3000)
//         
//         
//     })   
//    }
//})(jQuery)
//
//$('img').wassim()
  

$('#select1')
        
        .multiSelect( {
      afterInit: function(ms){
       
    var that = ms;
    var  $selectableSearch = this.$selectableTABLE.prev(); // input sherch <input  type='search'  class='search-input .....
    var  $selectionSearch = this.$selectionTABLE.prev();
    
      var  selectableSearchString = '#'+this.$newSelect.attr('id')+' .SELECT-selectable .SELECT-list .SELECT-elem-selectable:not(.OPTION-selected)'; // select par id (id Math.random())
      var selectionSearchString =   '#'+this.$newSelect.attr('id')+' .SELECT-selection .SELECT-list .OPTION-selected ';
      this.qs1 = $selectableSearch.quicksearch( selectableSearchString)
    

       this.qs2 = $selectionSearch.quicksearch(selectionSearchString) 
  }
  
    ,
  
    afterSelect: function(values,$_this){
    

  this.qs1.cache();
  this.qs2.cache();
  this.refresh()
    alert("Select value: "+values);
  },
    afterDeselect: function(values,$_this){
     
     
     this.qs1.cache();
     this.qs2.cache();
     
    alert("Deselect value: "+values);
  },

  //selectableFooter: "<div class='searchable'>Selectable footer</div>",
  //selectionFooter: "<div class='searchable'>Selection footer</div>",
  selectableHeader: "<input  type='search'  class='search-input img-thumbnail bg-info' autocomplete='off' placeholder='Rechercher'>",
  selectionHeader: "<input type='search'   class='search-input img-thumbnail bg-info' autocomplete='off' placeholder='Rechercher'>",
  dblClick:false,
  cssClass: 'size_class'
}
        
)
