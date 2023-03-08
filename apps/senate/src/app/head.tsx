import Script from 'next/script'

export default function Head() {
    return (
        <>
            <title>Senate</title>
            <link
                rel='icon'
                type='image/png'
                sizes='64x64'
                href='/assets/Senate_Logo/64/Black.svg'
            />
            <meta
                content='width=device-width, initial-scale=1'
                name='viewport'
            />

            <Script id='howuku'>
                {`(function(t,r,a,c,k){
                c=['track','identify','converted'],t.o=t._init||{},
                c.map(function(n){return t.o[n]=t.o[n]||function(){(t.o[n].q=t.o[n].q||[]).push(arguments);};}),t._init=t.o,
                k=r.createElement("script"),k.type="text/javascript",k.async=true,k.src="https://cdn.howuku.com/js/track.js",k.setAttribute("key",a),
                r.getElementsByTagName("head")[0].appendChild(k);
                })(window, document, "9mv6yAGkYDZV0BJEzlN34O");`}
            </Script>

            <link rel='icon' href='/favicon.ico' />
        </>
    )
}
