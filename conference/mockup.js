var myConference;
var gUrl = "https://gojiberry.iriscouch.com/"

$( document ).on( "click", "#btn-submit", function( e ) {
    console.log($("#txt-email").val() +" "+$("#txt-password").val() );
    var email = $("#txt-email").val();
    var password = $("#txt-password").val();
    if ((email==="info@gojiberrytech.com")&&(password==="12345678"))
    {
        console.log("success login");
        $.mobile.loading( 'show', {
            text: 'Signing In...',
            textVisible: true,
            theme: 'b',
            html: ""
        });
             
        
        myConference = new Conference(password);
        myConference.getDB(success);
        // load data here
        function success(db) {
            //alert(db.name);
            myConference.db = db;
            //myConference.code = password;
            //alert("db ok");
            $.mobile.hide;
            
            $("body").pagecontainer("change", "#speaker-page", {
                transition: 'fade',
                reload    : false
            });
            // go to main page
        };
        
    }
    else
    {
        console.log("error login"+$("#login-status").val());
        $("#login-status").html("Invalid Login");
        
    }
    
    
    
    //alert("submit");
                 
});

$( document ).on( "pagebeforecreate", "#speaker-page", function(event) {
   console.log("speaker page loaded"); //, db version="+myConference.getDBVersion());
   //  $( this ).append( "<elements> </elements>" )
   // get speakers in couch db
//   console.log(myConference.db); //.speakers[0].name);

   var speaker_html = "";
   for (speaker in myConference.db.speakers)
   {
        console.log(myConference.db.speakers[speaker].name);
        speaker_html = speaker_html + "<li class='list-speaker'> \
                         <a href='#speaker-profile-page' data-transition='fade'> \
                            <img src="+gUrl+"conference/"+myConference.code+"/speaker"+speaker+".jpg /> \
                            <h3>"+myConference.db.speakers[speaker].name+"</h3> \
                            <p><i>"+myConference.db.speakers[speaker].title+"</i></p> \
                            <p>"+myConference.db.speakers[speaker].company+"</p> \
                         </a> \
                      </li>";
   }
   //console.log(myConference.db.speakers[0].name);
   
   //populate speakers here
   $( "#speaker-list" ).append(speaker_html);
});

$( document ).on( "pagebeforecreate", "#speaker-profile-page", function(event) {
   console.log("speaker-profile-page loaded");
    var speaker_profile_html="";
   for (speaker in myConference.db.speakers)
   {
     speaker_profile_html = speaker_profile_html + "<div id='speaker-profile-index"+speaker+"'>        <table  class='ui-responsive'> \
          <tbody> \
            <tr> \
              <td> \
                 <img src="+gUrl+"conference/"+myConference.code+"/speaker"+speaker+".jpg /> \
              </td> \
              <td> \
                            <span><h3>"+myConference.db.speakers[speaker].name+"</h3> \
                            <i>"+myConference.db.speakers[speaker].title+"</i> \
                            <br />"+myConference.db.speakers[speaker].company+"</span> \
              </td> \
            </tr> \
          </tbody> \
        </table> \
        <h3>Profile</h3><hr > \
            <p>"+myConference.db.speakers[speaker].profile+"</p> \
        <h3>Sessions</h3><hr ><ul data-role='listview'>";
        
        
        for (session in myConference.db.speakers[speaker].sessions)
        {
           speaker_profile_html = speaker_profile_html + "<li id='session-topic"+session+"'><a href='#speaker-session-page' data-icon-'false'><table class='ui-responsive'> \
          <tbody> \
            <tr> \
              <h4>"+myConference.db.speakers[speaker].sessions[session].topic+"</h4> \
            </tr> \
            <tr> \
              <td> \
                <a data-theme='b' href='#' data-role='button' data-icon='location' data-iconpos='notext' class='ui-icon-nodisc' data-shadow='false' data-iconshadow='false'></a> \
              </td> \
              <td> \
                <p>"+myConference.db.speakers[speaker].sessions[session].location+"</p> \
              </td> \
            </tr> \
            <tr> \
              <td><a data-theme='b' href='#' data-role='button' data-icon='calendar' data-iconpos='notext' class='ui-icon-nodisc' data-shadow='false' data-iconshadow='false'></a></td> \
              <td><p>"+myConference.db.speakers[speaker].sessions[session].date+"</p></td> \
              <td> \
                <a data-theme='b' href='#' data-role='button' data-icon='clock' data-iconpos='notext' class='ui-icon-nodisc' data-shadow='false' data-iconshadow='false'></a>              </td> \
              <td> \
                <p>"+myConference.db.speakers[speaker].sessions[session].starttime+" - "+myConference.db.speakers[speaker].sessions[session].endtime + "</p></td> \
            </tr> \
          </tbody> \
          </table></a></li>";
        };
        
        speaker_profile_html = speaker_profile_html + " </ul></div>";
   }
   $( "#speaker-profile-content" ).append(speaker_profile_html);

    for (speaker in myConference.db.speakers)
    {
      $("#speaker-profile-index"+speaker).hide();
    }
    $("#speaker-profile-index"+myConference.db.selectedSpeaker).show();
 //  console.log($("#speaker-profile-index0"));
   //console.log($("#speaker-profile-index1"));

});

$( document ).on( "click", ".list-speaker", function( e ) {
    var selected_index = $(this).index();
    console.log("speaker "+selected_index+" clicked");
    
    myConference.db.selectedSpeaker = selected_index;
    
    for (speaker in myConference.db.speakers)
    {
      $("#speaker-profile-index"+speaker).hide();
    }
    $("#speaker-profile-index"+myConference.db.selectedSpeaker).show();

});


// *********************
// MODEL
function Conference (code) {
    this.code = code;
    this.db = "";
}
 
Conference.prototype.getDB = function(_success) {
    getData("conference/"+this.code,success);
    function success(result)
    {
        //this.db = result;
        //alert("ok");
        _success(result);
    };
};


function getData(resource,_success)
{
	$.ajax({
	     url: gUrl+resource,
	     type: "GET", 
	     dataType: "jsonp", // considered a cross domain Ajax request if not specified

	     success: function(result)
	     {
	        // success handling
			 console.log("SUCCESS!");
             //alert('Cross domain JS call achieved. Have your implementation going in here!');
			 //console.log(result.couchdb+", "+result.version);
			 _success(result);
			 
	     },
	     error: function(req, status, errThrown){
			 console.log("FAILED!");
			 console.log("error: "+req.reason+ " status: "+status+" " +errThrown);
	         // error handling
			 //alert(req);
			 //fail(req, status, errThrown);
	     }
	})
}
