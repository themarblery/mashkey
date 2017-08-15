<div class="post__body">
	<?php if ( is_single() ) :
		the_content();
	else :
		the_excerpt(); 
	endif; ?>
</div>
